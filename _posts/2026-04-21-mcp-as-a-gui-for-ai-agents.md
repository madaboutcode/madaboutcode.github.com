---
layout: post
title: "Your agent loves MCP as much as you love GUIs"
category: LLM, AI
forreview: false
---

I see discussions about [MCP](https://modelcontextprotocol.io) versus Skills all over Hacker News, Reddit, and X. And at least a couple of times now, friends have called me and asked for my opinion on it, because their technical leadership has been pushing them to adopt MCP across the board - build MCPs for all their internal tools, use it in their workflows for connecting with various systems and databases and all sorts of things. It makes sense to a degree - it's a standardized protocol, and every AI product supports it. And there is a lot of momentum behind it.

I have some experience with both sides of this. When MCP came out we adopted it for our internal tooling. We also tried building our own MCP for interacting with Jira, back before Jira had an official one. And over time I've moved most of my agent workflows back to scripts, CLIs, and skills. I've been repeating these discussions on enough calls that I figured I should just write them down.

A recent [blog post by David Mohl](https://david.coffee/i-still-prefer-mcp-over-skills/) and the [HN discussion](https://news.ycombinator.com/item?id=47712718) around it gave me the final push to sit down and do it. So here are my thoughts - something I can point people to the next time they ask.

## AI agents are NOT like another tool in your enterprise

Think about what happens when you give an AI agent an MCP for Jira. The MCP works - the agent can read your tickets, search, update, add comments. Which is cool. But then you ask it something like "hey, I think there's a ticket where this teammate left a comment about the deployment issue." And now the agent has to load up all your tickets, go through every one of them, pull all the details for each ticket, before it can find that one comment from that one person. All of that costs you tokens. Your context window is now filled with junk because it loaded like 9 unwanted tickets and you haven't even started your actual work on reproducing the issue. 

You know what this reminds me of? Good old GUIs. If you're anything like me, you find GUIs slow, limiting, and kind of annoying. You're in Jira, and you want to compare two tickets - you open them side by side or switch between tabs. You want to find all tickets mentioning a specific idea, you end up clicking through each one. It's convoluted, and you can only do what the UI lets you do. If you have the API, you can write a script that automates the whole thing. (Yes, the script might take two hours to write for something that takes ten minutes to click through. But we both know which one you'd rather have on Monday morning.)

At least the Jira UI lets you save a filter. The agent gets none of that. You can't save any of this for next time either. Same thing tomorrow. Same cost. Why would you do that when a script gives you the right answer every time and runs in milliseconds? Why trade repeatability, consistency and the knowledge pre-baked in the script for something like text with instructions that the Agent may or may not follow? 

A developer would have just written a script. Hit the API, filter by commenter, done. Works forever. And if you let the AI agent work the same way, it can do the same thing - build a custom tool, take the Jira APIs, put together exactly what it needs for the kind of work you do. MCP takes that away.

The more I work with agents, the more I see them as developers. They can quickly read up API documentation and whip up a script that actually does work with the API or take a large JSON dump and quickly understand the structure and find the data it needs. They're sloppy sometimes and they get hung up on stupid stuff, but they can write neat procedural code better than most entry-level developers. 

## MCP is like a GUI for Agents

So here's how I think about it. MCP is a GUI for AI agents.

GUIs exist for people who can't or shouldn't touch the API directly. They trade power for safety and discoverability. Take AWS - the Console is a GUI on top of the API. Once you've written Terraform or even just a quick Python script to spin something up, you know how much better that is than clicking through the Console. The Console still has a role - exploring a new service you haven't touched, finding that one setting. But you wouldn't build your infrastructure through it.

MCP is the same kind of thing. Friendly, constrained, kid gloves. And companies keep treating it as the integration layer for everything, when it's really just the on-ramp. An agent that can write code doesn't need the on-ramp.

People underestimate the costs, so let me get specific.

**Composability** - With CLIs and scripts, output from one tool pipes into the next. Build pipelines, pass data between steps, no ceremony. With MCP, every tool's output goes back through the model's context before it can feed the next call. The agent can't chain MCP tools the way it chains shell commands - the protocol just doesn't support it. [__alexs on HN](https://news.ycombinator.com/item?id=47716951) put it well - calling multiple MCPs just dumps results into context. Accumulation, not composition.

What does that look like? Say you want to find all Jira tickets assigned to you where a specific teammate left a comment. With MCP, the agent loads every ticket, every comment thread, burning through context before it can even start filtering. With a script:

```bash
jirapi "/search?jql=assignee=currentUser()&fields=id,key,summary,comment" | \
  jq '[.issues[] | select(.long_ass_jira_field_commenter_name == "Annoying Rajesh from QA") | \
        {key: .key, summary: .fields.summary}]'
```

Clean JSON list. Few hundred bytes instead of your entire Jira instance loaded into context. And you can pipe that into whatever's next.

**Token cost** -  Every MCP server you connect loads its tool definitions into context. Anthropic themselves [published numbers on this](https://www.anthropic.com/engineering/advanced-tool-use) - a five-server setup can hit 58 tools consuming around 55K tokens before the conversation even starts. Before the agent has done anything useful. And every intermediate result from every MCP call piles up too. You're paying for it in money, and the agent has less room to actually think about your problem.

**Reusability** - Even Jira's own UI lets you save a query and run it again. Developers build dashboards that show exactly what they need every morning. MCP gives the agent none of this. Every session starts from zero. You can try keeping a query around, sure, but that's going half the way. You can probably do a half-assed job with saved queries, but the real power is a script that does exactly what you need, every time, without burning inference. The script sticks around. The MCP interaction doesn't.

**Model cost** - Navigating MCP tools takes reasoning. Which tool to call, what came back, what to do next - you need a capable model for that, or it gets confused. Scripts flip this. You build them once with whatever model you need. The hard thinking happens then. After that, a cheap model can call the script and get the right answer every time. With MCP, you're paying for that reasoning again every single session.

## Let the agent be a developer

So what's the alternative? APIs. The thing that's worked for developers for decades.

Every model was trained on mountains of code that calls APIs. They already know how to read docs, write HTTP calls, handle auth headers and parse whatever comes back. There's nothing to invent here.

Skills - and I mean this in the Claude Code / agent sense - work like reference documentation. Think of it like a programming book. When you were learning Visual Basic and you needed to look something up before the internet as we know it today, you picked up a book. But you didn't read the entire book every time. You opened it to the chapter you needed, read that bit, and got on with it. Skills work the same way - the agent loads what it needs, when it needs it. Auth setup, base URL, a few example calls showing how the API actually behaves. Progressive disclosure, not the whole book upfront.

[antirez on HN](https://news.ycombinator.com/item?id=47715000) described the pattern I've been using - build a custom tool under the agent's guidance, then write a small markdown file explaining how to use it. Agent builds the tool, you review it, the markdown captures the knowledge. Every future session has access to it. With skills, the markdown is your skill instructions and script are included in the skills. 

I structure my skills in layers. Base scripts at the bottom that wrap the API - authentication, headers, response normalization. Then the data model so the agent knows what it's working with. Then ready-made scripts for the stuff I do every week, already built so the agent isn't figuring it out from scratch every time.

<figure style="text-align: center;">
<img src="/contents/img/20260421-skill-scripts.svg" alt="Layered scripts within a skill" style="max-width: 100%; height: auto;" />
<figcaption style="font-size: 0.8em; color: #666; margin-top: 0.5em;">Layered scripts within a skill</figcaption>
</figure>

With this layered approach even if the skill is missing script for an API, it can use the available base layers to call the API without worrying about common details like auth, base URLs, etc. 

A working example script teaches an agent more than pages of API docs. You run it, it works, no ambiguity. And every time you reuse it instead of having the agent reconstruct the same API call from scratch, that's inference you're not paying for. And agents can quickly take the existing code and adapt it to any scenario. 

## Where MCP does fit

Consumer chat without code execution - someone using Claude on their phone to check Gmail isn't going to maintain scripts. Fair enough. Non-developer users who can't or won't write scripts, also fair. And sometimes a provider specifically wants to expose a limited, safe interface.

But even the "just exploring a new API" case? I'm not sure. When I'm poking around something I haven't used before, I want to dump the raw JSON, pipe it through jq, filter it, see what's actually in there. With MCP the model burns its own tokens reprocessing the response and feeding pieces of it into the next tool call. With curl and a terminal I have the data right there. So even the exploration case is a bit iffy if you ask me.

The pure-chat-only environment is a shrinking market anyway. ChatGPT has code execution and skills in beta now. Claude supports it. There's [Codex](https://codex.com), Claude Cowork. Code execution is becoming table stakes. The assumption that agents can't run code is a 2024 design assumption, and it's already dated.

Know what's ironic? The latest Claude models can write Python to orchestrate MCP calls in [cloud code-execution environments](https://www.anthropic.com/engineering/code-execution-with-mcp). The fix for MCP's composability problem is letting the agent write code. Which is what skills and APIs were doing all along. Using MCP when your agent can write code is like fighting with one hand tied behind your back.

## The one thing MCP does better

Packaging skills and scripts has a real weakness: auth. When you wrap an API in a script, someone has to manage the tokens. I use the system keychain on my Mac plus a small auth helper in my skills that handles token storage and refresh. The agent builds on top of that. CLIs like `gh` and `aws` have this figured out too - credentials live on the machine, the CLI manages the session. For single-dev workflows, even a simple curl wrapper with the auth header included is enough.

But it's not as clean as MCP's OAuth flow. Clean popup, you log in, done. That is genuinely nice and I won't pretend otherwise.

MCP didn't solve all the security issues. The prompt injection threat is the same either way - an agent with malicious intent can do the same damage regardless of what protocol is in front of it. 

Secure AI agent access is still largely unsolved. Scoped access, audit trails, delegation limits, prompt injection resistance - we're early on all of it. Nobody has a good answer, not MCP, not skills, not anyone.

But this isn't as big of a problem. Developers use CLIs like GitHub and AWS CLI all the time and they have auth support, multiple account support etc. In the case of skills and script, we need better tooling and harnesses. That's all. 

There's another one I keep hearing from IT and engineering - they like MCP because they feel like they have control over what they expose. I heard the exact same argument when people built APIs over databases. Now they want to build MCPs over those APIs. You're just adding another layer on top of a security model you haven't fixed. Fix the damn security model - this has been a solved problem for decades. And if someone throws "legacy" or "unmaintained" at you - instead of an MCP, just expose the same functionality as an API. The documentation you were planning to write for the MCP? Put it there. Developers and AI agents benefit equally. You're not getting control. You're getting the feeling of control. You have an engine built for 300mph. Least we can do is not put bicycle tyres on it.

## So when your company asks

Should your company standardize on MCP for all AI integrations? No.

Treat your AI agents like developers. The docs you write for them are the same docs you'd write for a new engineer joining the team - if your developer docs are good, you're most of the way there. Organize for progressive disclosure so the agent can get auth and a base URL from a quick skim and go deeper when it needs to.

Build your scripts in layers - API wrappers at the bottom, data models in the middle, common scenario scripts on top. (See the diagram above.) The things your team does every week, pre-built so nobody's reconstructing them from scratch.

I use [uv](https://github.com/astral-sh/uv) for my Python scripts, with inline dependency metadata ([PEP 723](https://peps.python.org/pep-0723/)). The script carries its own requirements, no setup, no virtualenv dance. Works on Windows, Linux, Mac. If something goes sideways the agent figures it out.

And here's a trick that's been paying off: occasionally look at how the agent is actually using your skills. Have it audit its own patterns - what's it rebuilding every session that should already be a script? Build that script, add it to the skill. More usage, better tools, less wasted inference. It compounds.

Reach for MCP where the constrained interface genuinely matches what you need - consumer surfaces, non-technical users. Use it as the GUI it is.

Nobody has this figured out yet. We're discovering things as we go along - there are no right or wrong answers, and things change in a matter of weeks. In every corner of the world, developers and even technically inclined users are trying out different workflows. The AI companies are shipping features like prod is just another dev machine (and sometimes leaking their own source code to keep the legal team busy). Things will keep evolving. We'll see better tooling that addresses the limitations of MCP and skills, scripts, and everything else - or something we haven't even thought of yet.

Can't wait to open Hacker News or Reddit tomorrow and feel excited about the 10 new features and 4 new model releases. Hopefully I'll still have a job.
