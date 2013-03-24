---
layout: post
title: "CSS/jQuery Friendly Control IDs"
category: ASP.NET
---

Most of you might have heard about the changes to the way in which the “ID”
attribute will be rendered and the overall emphasis on
<a href="http://weblogs.asp.net/scottgu/archive/2010/03/30/cleaner-html-markup-with-asp-net-4-web-forms-client-ids-vs-2010-and-net-4-0-series.aspx">cleaner
  markup in ASP .NET 4.0</a> . But if you are like me - still stuck with ASP
.net 3.5 – there are ways to escape from horrible control ids like `ctl00_ContentPlaceholder1_ListView1_ctrl0_Label1`.

The value of the ID attribute that you see in the final HTML markup is picked up
from the ClientID property of a control. So, in effect, you can inherit any control
in ASP .net and override the ClientID property and return any value you want and this
will show up in the final markup.

#An Example - "Friendlier" HiddenField

> Talk is cheap. Show me the code
>                - Linus Torvalds

Okay Linus, whatever you say! Here is the code

{% highlight csharp %}
public class FriendlyHiddenField:HiddenField
{
    public override string ClientID
    {
        get
        {
            return ID;
        }
    }
}
{% endhighlight %}

Here, I create a “FriendlyHiddenField” that inherits from HiddenField, but overrides the
ClientID property, and returns the value of the ID property of the control. So if you have
a HiddenField like so,

{% highlight xml %}

<asp:FriendlyHiddenField ID="MyHiddenField" runat="server" >

{% endhighlight %}

The rendered HTML would be

{% highlight xml %}
<input type="hidden" id="MyHiddenField" />
{% endhighlight %}

You can do the same for any control in .net and this should give you fine-grained control
over your “IDs”.
