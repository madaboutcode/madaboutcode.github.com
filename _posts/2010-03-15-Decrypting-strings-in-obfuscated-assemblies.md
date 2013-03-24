---
layout: post
title: Decrypting strings in obfuscated assemblies
category: Reverse Engineering
---

Often in my day job I have to deal with assemblies that are obfuscated. String obfuscation
is one of the most common obfuscation techniques. I will try to
analyze string obfuscation used by Dotfuscator and decrypt it.

So lets first see what we are dealing with here. I have taken a very simple sample application
 and obfuscated it using Dofuscator.

**Before obfuscation:**
{% highlight csharp %}
    if (args.Length < 1)
    {
        Console.WriteLine("Syntax error: Correct syntax is {0}  [outputfile]", "SimpleDownloader");
        Console.ReadKey();
    }
{% endhighlight %}

**After obfuscation:**

{% highlight csharp %}
    int num = 19;
    if (args.Length < 1)
    {
        Console.WriteLine(a("昞传圢䐤弦न个弬崮帰䄲༴᜶稸吺似䴾⑀⁂ㅄ杆㩈㉊⍌㭎ぐ⭒畔㹖⩘筚♜潞ᱠ䍢奤ቦ᭨ݪ卬佮⩰ᱲtͶॸ๺ॼ᥾uda86", num), a("东瘞䰠匢䤤䈦洨䐪娬䄮崰尲吴匶尸䤺", num));
        Console.ReadKey();
    }
{% endhighlight %}

*Wait a minute! Is that Chinese?*

Let’s look closer. All our strings have been transformed into something that looks
like Chinese and now there is this method named ‘a’ which takes in the encrypted
string and an integer as the arguments. This integer is kind of a secret key which
varies from method to method. So, if we pass in the encrypted string and the correct
integer value, this method should be able to return the decrypted string.

We can approach this in a couple of ways.

- Write an app that will take in the encrypted string and show you the decrypted string.
 *\[Easy, can be done with simple reflection, but not very effective\]*
- Write an app that will take the assembly as the input and return you one with all the
 strings decrypted. *\[Complicated, must use a library like [Mono.Cecil][2] or [CCI][3]
 which can edit the assembly, the best solution\]*


To keep my first blog post ( oh, ya.. this is the first! ) short and simple,
let’s go ahead and do it the simple way. But in the second part of this post,
I’ll show you how to patch the assembly itself. So here is my plan for doing
it in the simple way:

1.  Take in the encrypted string as input (also the secret key)
2.  Use reflection to invoke the method ‘a’ and decrypt the string
{% highlight csharp %}
    string encryptedString = "东瘞䰠匢䤤䈦洨䐪娬䄮崰尲吴匶尸䤺";
    int key = 19;

    Assembly assembly = Assembly.LoadFile(assemblyPath);

    // Okay, It’s sample code.. what do you expect! :)
    MethodInfo secretMethod = assembly.GetModules()[0]
                  .GetMethods(BindingFlags.NonPublic
                          | BindingFlags.Public
                          | BindingFlags.Static)[0];
    string decryptedString = secretMethod.Invoke(null, new object[] {encryptedString, key}) as string;
{% endhighlight %}

That’s all folks!

Now this approach has several problems like it is painful, you cannot do a string search in reflector on this assembly etc. We’ll try to overcome all these difficulties in the second part of this article.

I have created a sample winforms application that implements this approach and you can [download the solution from here][4].

Phew! After 2-3 months of struggling with my lazy self, I have managed to complete my first blog post. This is epic! Guys, if you find it interesting, keep me motivated with your valuable comments/feedback.

 [2]: http://www.mono-project.com/Cecil "Mono.Cecil"
 [3]: http://ccimetadata.codeplex.com/ "Common Compiler Infrastructure"
 [4]: http://dl.dropbox.com/u/199998/madaboutcode/UnObfuscator.zip
