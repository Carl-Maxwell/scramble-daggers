
# Random Chance Syntax for Games

Often, [randomness in games is different](https://www.youtube.com/watch?v=bY7aRJE-oOY#t=9s)
from randomness in other circumstances. Pure chaotic randomness is *unfair* and so is
generally undesirable. Usually, what you want to do is say something like:

> "Out of every 10 chests opened, 3 will have a gold coin in them,
and out of every 200 chests opened, 4 will have a golden chalice in them."

You don't want to just say:

> "Chests have a 30% chance of having 1 gold and a 2% chance of having a golden
chalice"

You want to fix the numbers so that the outcomes are *guaranteed*, or rather,
*controlled*. You want to fix it so that, over a large enough sample size, the
result of a player's effort will be guaranteed.

Or, you might not want it to be quite *perfect*, maybe you want to use percent
chances, but have them change over time:

> "Chests have a 1.7763568394002505^-15 chance of having a golden chalice, except
every time you open a chest and don't acquire a golden chalice the odds of
finding one double, and each time you acquire a golden chalice they return to
1.7763568394002505^-15."

(That number is just 2 to the fiftieth power: 2 divided by 2 fifty times. This
way your odds reach 2% at 50 tries, and hit 128% after 7 more tries.)

There is not a lot of difference between this and the first solution, in fact,
if we do not use an even distribution with the first solution, the two solutions
can give identical outputs. The difference, then, is largely one of *preference*
or *optimization*. I would say that the best solution would be defined by how
intuitive it is to make use of.

My ideas for the two APIs were this:

```
Chance("2/(2^50) fail: c*2 success: 2/(2^50)")
```

and this:

```
Chance("4 out of 200")
```

I decided on the latter option.
