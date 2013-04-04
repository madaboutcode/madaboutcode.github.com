---
layout: post
title: "Clean Code : Single Responsibility Principle"
category: Clean-Code
forreview: false
filename: "2013-04-02-clean-code-SRP.md"
---

I have been writing code for more than a decade now. When I take a look at code that I had written a few years back, I cringe in shame and wonder how I got away with it. In my formative years, I was more focused on solving a technical challenge than caring about how I structured my code to make it happen. The one thing that has helped me focus more on writing more readable code  was the realization that code is written only once, but read **many** times.

With this blog post, I'm kicking-off  a series called "Clean Code" that tries to document my learnings in my struggle to write better, readable, maintainable code.

#Single responsibility principle

Single responsibility principle(SRP) is one of those core principles that will vastly improve the way you structure your code.  It is part of the [SOLID][] principles introduced by Robert C Martin.  

[Wikipedia defines SRP][] as:

> Every class should have a single responsibility, and that responsibility should be entirely encapsulated by the class. All its services should be narrowly aligned with that responsibility.

What does that mean? Each class in your code base should have a **single well-defined purpose** . Let's try to understand that with this example of a bank account class.

{% highlight csharp %}
  class BankAccount
  {
    void Credit(float amount, string remarks);
    void Debit(float amount, string remarks);
    float GetBalance();
    float CalculateInterest();
  }
{% endhighlight %}

Does the above class violate SRP? `Credit`, `Debit` and `GetBalance` are all functions of a bank account. What about `CalculateInterest`?  Do we really want to tie the calculation of interest to a bank account? It is convenient that you can call `bankaccount.CalculateInterest()` and get back the interest on that account, but does it make sense?

Interest calculation is a pretty involved process. Most of today's banks have complicated rules and processes based on which they calculate interest for an account. So it makes sense to separate out that interest calculation logic into another class - say `InterestCalculator` *( yeah.. lame name.. )*. Now, our code to calculate the interest would look something like this:

{% highlight csharp %}
  var interest = interestCalculator.Calculate(account);
  account.Credit(interest, "Interest for the period ..blah..to..blah");
{% endhighlight %}

*(Isn't this how interest shows up in your account history?)*

What advantage does this provide? Just like what happens with most software solutions, interest calculation starts off as a simple feature. As time goes, the business starts adding more fancy savings schemes for customers and the interest calculation logic will keep evolving.

With the old design, the interest calculation logic is embedded in the bank account class and changes to interest calculation could introduce bugs in your bank account logic as well. Moreover, since there is no clean separation of responsibilities, more and more functionality would get added into the bank account class and you end up with one big tangled mess that is difficult to understand and maintain.

![Spaghetti Code][spaghetti-code]

Photo: [Flickr][2]

If you have the interest calculation logic totally separated out, every time you change the code for interest calculation, your bank account class should mostly remain unaffected. Also, you could refactor your code in such a way that each interest scheme is a separate class and the interest calculator class could pick up the right scheme to use based on the account type and various other parameters. Having these small, focused classes makes your code easy to understand and maintain.

#I want more!

Even though single responsibility principle is usually used for classes, you could take it even further.

- Each component in your system should have a single responsibility.
- Each class in your component should have a single responsibility.
- Each method in your class should have a single responsibility.

I have had good mileage applying the SRP to methods. It gives me small, focused methods that can be combined together to achieve a larger goal. As a side effect, I've also found that this increases code reuse.

#Don't get it right the first time?

You may not end up with this type of a clean separation of concerns the first time you build a feature. Not to worry. Refactoring is your friend. Get in there, break it apart and revel in the glory of your readable, maintainable code! :)

[SOLID]: http://en.wikipedia.org/wiki/Solid_(object-oriented_design)
[Wikipedia defines SRP]: http://en.wikipedia.org/wiki/Single_responsibility_principle
[spaghetti-code]: http://farm3.staticflickr.com/2335/2176839381_50f8cbe72b_z.jpg
[2]: http://www.flickr.com/photos/ndomer73/2176839381/sizes/z/
