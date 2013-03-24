---
layout: post
title: "Reverse engineering to fix a bug - Part II"
category: Reverse Engineering
---

[  This is the continuation of an [earlier post][1] ]

Sorry about the delay in posting this second part. So many things!

So where were we? My attempts to patch the code failed as reflexil (or rather [mono.cecil][2] )
was unable to rebuild this weird assembly properly after patching it. I looked at alternatives
like [CCI][3]. But they were even worse.

Don’t we have a tool that I could use to fix this thing?! I almost gave up at that point. But
then guys, I am a developer. What do we developers do when there are no tools to get the job done??
We build them!

*\[ Okay, so that last part is not completely true. I didn’t build a whole new tool. I cheated a bit.
Keep reading and you will find out.. \]*

Here are the things I needed to do:

1.  Remove the strong name from the assembly and update all the references to this assembly
2.  Patch the check for path length of `200`.

To fix the first part, I started searching for tools that could remove strong names and update
references and stumbled upon this little gem from Andrea Bertolotto at CodeProject :
[Removing strong-signing from assemblies at file level (byte patching)][4].
After a bit of fiddling around trying to understand the code and tweaking it to my needs,
I had a tool that could open my assembly, remove the strong name, find all assemblies that
reference it, update the references and do it recursively for all those assemblies. And the
best part, after deploying these new assemblies, the compiler didn't notice a thing! It worked
like a charm! [HA HA HA HA HA…][5]

Okay, enough of celebration! Let’s take care of the next part. All I need to do is change that
`200` to something larger, say 1000. Do I need to  open the assembly in an editor, change the value
and rebuild it? Let’s go ninja! Why not open it in a hex editor and just change the two bytes
(`200` in decimal = 2 bytes in binary)?  That would be cool! <img alt="hexedit" src="/contents/img/2010-07-26-hexedit_thumb.gif" align="right"/>

I fired up my favorite hex editor, [Hiew][7] (Hacker’s view) and opened the assembly.
There it is, the assembly in all its glory. Now, where the heck are those two bytes?

After burning up a few brain cells, it occurred to me that a disassembler should be able to tell
me that. [ For those of you who are not familiar with a disassembler, it is kind of like reflector.
It converts the machine instructions in the assembly to semi-human readable assembly language. ].
As there is a one-to-one correspondence between assembly instruction and machine code, it is easier
to map one with the other and get the exact address of the our “check if less than `200`”
instruction easily.

After looking around a bit at the disassembly, I found the address of the instruction, switched
over to my hex editor and located that address. BAM! There is my `200`! In reality, the hex code
for `200` – `C8 00` ([little endian byte ordering][8]). I changed it to `1024` which is `00 04` in
hex. And that is it!  I deployed the new assembly and presto! Bug resolved!

So my dear readers, even though I wouldn’t recommend patching third party assemblies to fix their
bugs, it must be reassuring to you that it is possible. Even when you have obfuscated strongly
named assemblies - all you need is a lot of patience and a butt load of time!

 [1]: /2010/04/reverse-engg-to-fix-bug-1.html "Reverse engineering to fix a bug? - Part I"
 [2]: http://www.mono-project.com/Cecil "Mono.Cecil"
 [3]: http://ccimetadata.codeplex.com/ "Common Compiler Infrastructure"
 [4]: http://www.codeproject.com/KB/security/StrongNameRemove20.aspx
 [5]: http://www.youtube.com/watch?v=-vVbIaBXtJ8#t=00m07s
 [6]: /contents/img/2010-07-26-hexedit_thumb.gif "hexedit"
 [7]: http://en.wikipedia.org/wiki/Hiew
 [8]: http://en.wikipedia.org/wiki/Little-endian
