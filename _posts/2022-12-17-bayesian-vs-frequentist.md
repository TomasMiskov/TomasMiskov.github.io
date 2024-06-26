---
layout: post
title: Discovering the Bayesian Universe
category: learning
---
### What is this post about?
Yesterday I submitted my final assignment for my Bayesian Econometrics course and it was one hell of a journey. Definitelly hated the Bayesian approach at the beginning, but going through the exercises, seeing the effects of priors, and gaining an appreciation for some sophisticated Monte Carlo integration techniques, I must say it's not that bad at all. So here's a little run down on main differences with frequentist ideology that basically boils down to those pesky integrals.

---
{: data-content="Let's go"}

### Frequentists vs. Bayesians
Let's start by noting down some key paradigm shifts when moving from the *frequentist* to the *Bayesian* school of thought:

-   **Definition of probability**:
	- In *frequentist statistics*, probability is defined as the long-term frequency of an event occurring in a large number of trials. 
	- In *Bayesian statistics*, probability is defined as a degree of belief or confidence in an event or hypothesis.
-   **Use of data**:
	- In *frequentist statistics*, data is used to estimate the *likelihood of an event occurring* based on a fixed set of assumptions (e.g. the assumed data generating process). 
	- In *Bayesian statistics*, data is used to update the *degree of belief* or confidence in an event or hypothesis (the prior).
-   **Incorporation of prior knowledge**: 
	- In *frequentist statistics*, prior knowledge is *NOT* typically taken into account in the analysis. 
	- In *Bayesian statistics*, prior knowledge can be incorporated into the analysis through the use of *prior distributions*. True Bayesians always identify a prior distribution of the parameters of their model.
-   **Interpretation of results**: 
	- In *frequentist statistics*, statistical inference is based on the idea of *repeated sampling* from a population and the resulting probabilities are based on the *frequency of the events* occurring in these samples. 
	- In *Bayesian statistics*, statistical inference is based on the idea of updating the degree of belief in an event or hypothesis as new data becomes available, and the resulting probabilities reflect the updated degree of belief. In math-speak, Bayesians combine their prior, with the data likelihood to obtain their posterior beliefs.
-   **Guiding Equations**:
	- In the *frequentist world* the data is assumed to come from some data generating process (DGP), where every data point is seen as an independent sample. The parameters of the model that describes the DGP are estimated through a maximum likelihood estimation. That is equivalent to answering a question: *Given the data we observe, what is the most likely value of the parameters of our model that would result in generating this sample?* The maximum likelihood is then defined as $$\begin{equation}\hat{\theta} = \arg \max_{\theta} \prod_{i=1}^n p(y_i \mid  \theta)\end{equation}$$
	- In the *Bayesian world* there is no such idea as obtaining just the most likely parameter of our assumed model. Instead, the goal is to find the entire distribution of our parameter, so we can quantify the mentioned uncertainty about our belief in the parameter's precise value. This is done as a combination of our prior belief and the likelihood function from the *frequentist world*: $$\begin{equation}P(\theta\mid Y) = \frac{P(Y\mid \theta)P(\theta)}{P(Y)}\end{equation}$$

### How much harder is it to estimate $P(\theta\mid Y)$ than $\hat{\theta}$ ?
A lot...

First of all, Bayesian analysis is full of pesky unsolvable integrals. Where do they come from? Well, from everywhere! The "problem" lies in the fact that all models that try to explain the world at least somewhat accurately (a discussion for another time) contain very many parameters. If we want to get to the bottom of any single parameter independent of the others, we need to marginalize their joint distribution. Marginalization is basically a process of removing the effects of the parameters we are not interested in. And in the case of continuous probability distributions, we need to integrate out whatever parameters that are in our way. In fact, the problem already starts in the basic Bayes formula. The denominator is the marginal likelihood of our data, or the overall probability of observing this particular sample independent of our model or its parameters. Quite a dubious concept really. But it is most easily denoted as a marginalization of our posterior:

$$
\begin{equation}
P(\theta \mid  Y) = \frac{P(Y \mid  \theta) P(\theta)}{\int P(Y \mid  \theta) P(\theta) d\theta}
\end{equation}.
$$

So we have just begun, and already this first integral is in most cases unsolvable. Unless we have a conjugate prior, we are in trouble. A side note on what's a conjugate prior: It is such a distribution $p(\theta)$ that when we multiply it by our likelihood function $\prod_{i=1}^n p(y_i \mid  \theta)$ we again get a nice distribution whose form and normalizing constant we can *easily* compute. So it's a prior that prevents a pesky integral from arising. It yields a nice integral, it's a * good boy* prior, woof, woof. Unfortunately though, most priors and likelihood combinations are not well-behaved, so pesky integrals arise, and we are back to square zero. Here is where we give up and resort to numerical approximations.

### Monte Carlo baby!
The basic principle of Monte Carlo integration is to generate a large number of random points within the domain of the integral, and then use these points to estimate the value of the integral. This is done by evaluating the function at each of the random points and averaging the results. The more random points, the better the approximation. If the points are sampled at random, we are talking about the classic Monte Carlo (MC) simulation. The potential drawback of this basic method is that it may take very many samples to get a good approximation, and that it may actually be impossible to do if we do not know the closed form of the function we are trying to evaluate. So in some cases we can just use this basic MC to get our posterior and do proper Bayesian inference, what do we do in the rest of the cases?

We extend MC into MCMC! No, that's not Monte Carlo Monte Carlo, it's Markov Chain Monte Carlo. It is an extension of the basic MC that instead of drawing samples independently, draws samples conditionally on the previous draw - that's the [Markov Chain](https://en.wikipedia.org/wiki/Markov_chain) part. That is, we use conditional distributions of our model's parameters to draw samples of individual parameters one-by-one and exploit the bits of knowledge we learn about the function along the way. These bits of knowledge allow us to focus on sampling from the higher density regions of our function more frequently, thus approximating the important part of the function much better than its potentially irrelevant low density tails. 

The two OG methods of MCMC are Gibbs and Metropolis-Hastings samplers. Gibbs is useful when we can derive conditional probabilities of one parameter on the rest, while Metropolis-Hastings is useful when we cannot do that, and we have to resort to using some approximate candidate distribution. I say candidate here because in M-H we draw proposed values of our parameters and then based on an acceptance threshold decide if the value is accepted or not. It's all nice and easy to explain in this abstract bird's eye view, but the details are gritty and for another time and type of a blog post.

### Finally: How do we predict/forecast?
In the usual frequentist setting prediction is straight forward. We found our $\hat{\theta}$ so plugging it into our model along with new observation $x_{N+1}$ we get our predicted value $y_{N+1}$. What do we do in the Bayesian setting where instead of $\hat{\theta}$ we got the entire distribution $P(\theta\mid Y)$ ? You guessed it, we evaluate a pesky integral. The integral we are interested in is 
$$
\begin{equation}
p(y_{N+1}\mid y) = \int p(y_{N+1}\mid \theta)p(\theta\mid y)d\theta
\end{equation},
$$
where on the left-hand side we have the probability of a new observation $y_{N+1}$ given $y$, which is equivalent to marginalizing $\theta$ out of the right-hand side equation. The right-hand side is basically the likelihood of observing $y_{N+1}$ given our model multiplied by what we have learned about our model's parameters - the posterior distribution of $\theta$. This again gives us the entire analytical or approximate distribution of our prediction. To be able to make a comparison with our frequentist friends, I repeat, FRIENDS, we can evaluate this distribution at e.g. its mean or median and report a point estimate of $y_{N+1}$ alongside some uncertainty quantification like a standard deviation or a mean squared error.

And that's all friends! As usual, this is more of a post for myself so I do not forget the big picture ideas I've learned in my Bayesian Econometrics course. There's a lot more math and a lot more nice simulations, which I hope to get to soon enough and make nice visualizations or a demo showing the fundamental differences between frequentist and Bayesian inference. Until then, bon voyage!