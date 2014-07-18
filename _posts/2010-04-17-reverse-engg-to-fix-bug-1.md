---
layout: post
title: "Reverse engineering to fix a bug - Part I"
category: Reverse Engineering
---

Ever had that feeling of helplessness when you find that the critical production issue you
were trying to fix is all because of some lame bug in a third party software you are using?
Now, all you can foresee is wasting all those hours trying to convince the vendor’s tech
support  team that it is actually a bug and answering all those dumb emails!

I had to tackle such a bug this week. We wanted to reorganize our website to meet a business
requirement. While trying to move some contents, this third party tool we use started
displaying errors that the path of the content is longer than `200` characters.
Dear readers, I am tempted to explain the whole scenario here. But that will be a waste of
your time and my keystrokes. So trust me;  this `200` character limit was the side effect of
a lame fix the vendor made for a different bug.

<img alt="Reflexil" src="/contents/img/2010-04-17-reflexil.jpg" align="right"/>
After raising the case with tech support, as a temporary solution, I tried to see if there
was a way to just change this 200 to a larger value. After fiddling with the assembly in
[Reflector][1], I located the code that needed to be ‘fixed’. Now reflector doesn’t support
editing assemblies. For that, we need to fire up the most awesome reflector plug-in – [Reflexil][2].

After ploughing through all that IL code, I was able to locate the instruction that compared
the length of the path with `200`. *\[ Wow! Now all I have to do is change it to a larger value
and I’m done! \]*

After editing the value, I tried to save the file. Our good friend Reflexil reminded me of something:

![Reflexil Dialog][10]

Okay. The assembly is signed and if I modify it, .net runtime will refuse to load it. That’s
not good! Hey, wait a minute. Reflexil has a “Remove Strong Name” option. That is great! Or is it?

The third party system we are dealing with here has a gazillion assemblies. If I remove the
strong name from one assembly, I will have to update all the assemblies that refer to that one,
which, by the way, are also signed. Then I will have to remove the strong name from all of them
and also update the assemblies that refer to these and so on. It is a chain reaction.
*\[ Oh boy! This is going to take a while! \]*

Good thing, Reflexil is open source. I went ahead and downloaded the source code from [sourceforge][5]
and started looking around. Reflexil uses [Mono.Cecil][6] for reading and manipulating assemblies.
Since I had used Cecil in a few hobby projects before, I was able to easily wire up some methods
into a simple console app that goes through the assemblies and their references and removes the
strong names and fixes the references. *\[ Damn! I’m good! \]*

I replaced the old assemblies with my new and ‘**improved**’ version, fired up the browser and
navigated to the website. After waiting for a few seconds, I got the ASP .net [yellow screen of death][7].
A quick look at the event viewer and my heart sank! The error message read:

    Faulting application vbc.exe, version 8.0.50727.3053, stamp 4889df5b, faulting module vbc.exe,
    version 8.0.50727.3053, stamp 4889df5b, debug? 0, fault address 0x00004040.

The VB .net compiler just crashed trying to compile the website using my ‘improved’ assemblies!
Now when the compiler crashes, you know it is bad! Analyzing an error like this is beyond the
capabilities of my brain. One thing I know for sure is that Cecil is not able to properly handle
the [obfuscation][8] on these assemblies. So my best guess is that after processing these assemblies
through Cecil, there is some resultant weirdness for which the compiler is freaking out.

*Now that his own tools have failed him, what will he do? *Will the hero save the day? *For
answers to all these questions, watch out for the [next part of this blog post][9]! :)*

 [1]: http://www.red-gate.com/products/reflector/ "Reflector"
 [2]: http://sebastien.lebreton.free.fr/reflexil/ "Reflexil"
 [4]: /contents/img/2010-04-17-reflexil.jpg "Editing assembly in Reflexil"
 [5]: http://sourceforge.net/projects/reflexil/ "Sourforge project page for Reflexil"
 [6]: http://www.mono-project.com/Cecil "Mono.Cecil"
 [7]: http://en.wikipedia.org/wiki/Screens_of_death "Read about the yellow screen of death in wikipedia"
 [8]: /2010/03/Decrypting-strings-in-obfuscated-assemblies.html "Dotfuscator obfuscation"
 [9]: /2010/07/reverse-engg-to-fix-bug-2.html
 [10]: /contents/img/2010-04-17-reflexil-dialog.png "Reflexil Dialog"
