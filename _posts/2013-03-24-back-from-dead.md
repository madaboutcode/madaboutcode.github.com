---
layout: post
title: "Back from the dead"
category: General
reviewed: false
---
![Back from the dead](http://farm3.staticflickr.com/2735/5807179168_41db33897d_z.jpg)

*Photo: [Flickr](http://www.flickr.com/photos/natura_pagana/5807179168/sizes/z/in/photostream/)*

The last post on this blog was from the summer of '10. Since then, things got a little hectic and I was not able to dedicate much time to this blog. Things are little better now and after a lot of nagging from a lot of people, I've decided to revive this blog. 

The previous version of this blog was powered by a little blog engine that I had built (partially so that I could learn ASP.NET MVC) called **Chronicles**. The [code is available on github](https://github.com/madaboutcode/Chronicles).   It's a typical MVC application with SQL server as the datastore and with a disk based caching mechanism which made it low on memory usage so that I could host it on a [cheap shared hosting account](http://www.winhost.com/). Once a view is generated from the database, it gets cached to disk and subsequent requests are served from the disk cache. As soon as a new comment or blog post is added, it wipes out the entire cache and regenerates it on subsequent  requests. This worked pretty well, staying afloat as much as my hosting provider allowed it to. 

Now think about this - in the past 2.5 years, there have been no updates to the blog. In effect every single one of the requests were being served from the disk cache. For the most part of those 2.5 years, SQL Server was sitting there gathering dust. What a waste! 

So when I decided to revive this blog, I wanted something more efficient. That's when I read about [Jekyll](https://github.com/mojombo/jekyll#jekyll) and [github pages](http://pages.github.com/). It is an elegant and efficient solution to the whole problem of hosting a simple blog like this. 

Jekyll is *blog aware* static site generator. You create your site in a specific structure using liquid templating engine. Once you have made the necessary changes to the site, run Jekyll on this directory and it outputs static HTML files which can be server using any web server. 

Github pages makes this even simpler. You can push your Jekyll site to a github repo (the repo should be named *your_github_username*.github.com) and github will automatically run Jekyll on it and the resulting html will be available at *github_username*.github.com. Now if you want to host this website under your own domain, just create a file named `CNAME` with the name of your domain and put it into the root of your repo.  

My current workflow for posting a blog post looks like this:
1. Write up the whole post in [markdown](http://en.wikipedia.org/wiki/Markdown) format and save it into the special `_posts` directory in  Jekyll
2.  Push the changes to my [github repo](https://github.com/madaboutcode/madaboutcode.github.com). 
3. Github has a post commit hook that kicks off Jekyll which regenerates the changed/new html pages. 
4. The blog post is live! 

Commenting is handled using [Disqus](http://disqus.com/). 

You can find the source code for this blog at [https://github.com/madaboutcode/madaboutcode.github.com](https://github.com/madaboutcode/madaboutcode.github.com). Take a look and feel free to fork it and use it for your own blog.
