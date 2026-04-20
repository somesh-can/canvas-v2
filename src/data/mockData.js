export const presentationData = {
  title: "Interactive Strategy Insights",
  logo: "https://ucarecdn.com/a649594f-cb6f-4484-b5b2-ccb27033143e/-/format/auto/",
  goal: "Align on our strategic direction for 2026 and beyond.",
  metrics: [
    { label: "Respondents", value: "124" },
    { label: "Themes Identified", value: "6" },
    { label: "Messages sent", value: "482" },
  ],
  voting: {
    question:
      "Which strategic theme should we prioritize first for execution in 2026?",
    votesPerPerson: 3,
    joinUrl: "canvas.vote/join/2026-sync",
    joinCode: "882 109",
  },
  questions: [
    {
      id: "q1",
      text: "What do you believe is the single biggest opportunity for our company in the next 3 years?",
    },
    {
      id: "q2",
      text: "If we changed one thing about how we communicate our strategy, what should it be?",
    },
  ],
  quotes: [
    {
      id: 1,
      text: "We need more clarity on the 'why' behind our decisions, not just the 'what'.",
      color: "lavender",
    },
    {
      id: 2,
      text: "The cross-departmental collaboration is our superpower, but we don't use it enough.",
      color: "blue",
    },
    {
      id: 3,
      text: "Communication feels like it's happening in silos. We need a central source of truth.",
      color: "sage",
    },
    {
      id: 4,
      text: "I feel like we're moving fast, but I'm not always sure we're moving in the right direction.",
      color: "peach",
    },
    {
      id: 5,
      text: "The feedback loops are too slow. By the time we react, the market has moved.",
      color: "butter",
    },
    {
      id: 6,
      text: "Our values are strong, but they don't always translate to daily workflows.",
      color: "blush",
    },
    {
      id: 7,
      text: "Innovation should be everyone's job, not just the product team's.",
      color: "lavender",
    },
    {
      id: 8,
      text: "We need to stop doing 'more' and start doing 'better'. Focus is key.",
      color: "blue",
    },
    {
      id: 9,
      text: "The remote-first culture is great, but we miss the spontaneous brainstorming sessions.",
      color: "sage",
    },
    {
      id: 10,
      text: "Transparency is improving, but executive decisions still feel like a black box sometimes.",
      color: "peach",
    },
    {
      id: 11,
      text: "We should invest more in our internal tools. Friction is killing productivity.",
      color: "butter",
    },
    {
      id: 12,
      text: "The growth is exciting, but we need to ensure our culture scales with us.",
      color: "blush",
    },
    {
      id: 13,
      text: "Let's simplify our reporting. We spend more time talking about work than doing it.",
      color: "lavender",
    },
    {
      id: 14,
      text: "Diversity of thought is present, but we need safer spaces to disagree constructively.",
      color: "blue",
    },
    {
      id: 15,
      text: "The onboarding experience was stellar, but the first six months felt like a blur.",
      color: "sage",
    },
  ],
  themes: [
    {
      id: "t1",
      title: "Strategic Clarity",
      description:
        "A strong desire for clearer communication of the long-term vision and the reasoning behind major strategic pivots.",
      count: 45,
      percentage: 36,
      color: "lavender",
      subthemes: [
        "Vision Alignment",
        "Decision Transparency",
        "Roadmap Clarity",
      ],
      quotes: [
        {
          id: 101,
          text: "I want to know why we are choosing this path over others.",
        },
        {
          id: 102,
          text: "The strategy deck was good, but how does it change my daily work?",
        },
        { id: 103, text: "We need a north star that everyone can point to." },
        {
          id: 104,
          text: "Our vision feels abstract. How do we measure success concretely?",
        },
        {
          id: 105,
          text: "Strategic updates come too infrequently. We need regular touchpoints.",
        },
        {
          id: 106,
          text: "I'd love to see how my team's work ties into the bigger picture.",
        },
        {
          id: 107,
          text: "The quarterly goals are clear, but the multi-year vision is fuzzy.",
        },
        {
          id: 108,
          text: "Decision-making seems reactive rather than proactive sometimes.",
        },
      ],
    },
    {
      id: "t2",
      title: "Operational Focus",
      description:
        "Feedback regarding the need to prioritize fewer, high-impact initiatives rather than spreading resources too thin.",
      count: 38,
      percentage: 31,
      color: "blue",
      subthemes: [
        "Resource Allocation",
        "Priority Setting",
        "Process Efficiency",
      ],
      quotes: [
        { id: 201, text: "We're trying to do too many things at once." },
        {
          id: 202,
          text: "Let's finish what we started before launching the next big thing.",
        },
        {
          id: 203,
          text: "Our resources are stretched thin across too many projects.",
        },
        {
          id: 204,
          text: "I'm not sure which tasks are actually urgent versus just noisy.",
        },
        {
          id: 205,
          text: "We need clearer criteria for what gets prioritized and why.",
        },
        {
          id: 206,
          text: "Process improvements could save us hours every week.",
        },
        {
          id: 207,
          text: "The roadmap changes so often, it's hard to commit to anything long-term.",
        },
        {
          id: 208,
          text: "Sometimes I feel like we're moving fast but not forward.",
        },
      ],
    },
    {
      id: "t3",
      title: "Collaborative Culture",
      description:
        "Recognition of our strong team bonds coupled with a request for better tools and processes to bridge departmental silos.",
      count: 32,
      percentage: 26,
      color: "sage",
      subthemes: ["Cross-team Sync", "Knowledge Sharing", "Social Connection"],
      quotes: [
        { id: 301, text: "The best ideas happen when we talk across teams." },
        { id: 302, text: "Silos are our biggest enemy." },
        {
          id: 303,
          text: "I wish there was an easier way to see what other teams are working on.",
        },
        {
          id: 304,
          text: "Our culture is amazing but we need better systems to preserve it as we grow.",
        },
        {
          id: 305,
          text: "Knowledge is trapped in people's heads. We need better documentation.",
        },
        {
          id: 306,
          text: "Cross-functional projects are the most rewarding but also the hardest to coordinate.",
        },
        {
          id: 307,
          text: "Remote work is great but we're missing the informal hallway conversations.",
        },
        {
          id: 308,
          text: "I learn the most when I can shadow someone from a different department.",
        },
      ],
    },
    {
      id: "t4",
      title: "Leadership Visibility",
      description:
        "Teams want more regular access to leadership context, clearer decision ownership, and visible follow-through on commitments.",
      count: 24,
      percentage: 19,
      color: "peach",
      subthemes: ["Decision Ownership", "Leadership Access", "Follow-through"],
      quotes: [
        {
          id: 401,
          text: "I want to hear more directly from leadership when priorities change.",
        },
        {
          id: 402,
          text: "We need clearer accountability for who owns the final call.",
        },
        {
          id: 403,
          text: "Visibility matters more than perfection when change is happening quickly.",
        },
      ],
    },
    {
      id: "t5",
      title: "Learning Velocity",
      description:
        "People are asking for faster feedback loops, more experimentation, and clearer ways to learn from what is working.",
      count: 18,
      percentage: 15,
      color: "butter",
      subthemes: ["Experimentation", "Feedback Loops", "Shared Learning"],
      quotes: [
        {
          id: 501,
          text: "We need to know faster whether something is working or not.",
        },
        {
          id: 502,
          text: "Small experiments would help us learn without overcommitting.",
        },
        {
          id: 503,
          text: "Good insights are getting lost because we do not close the loop visibly.",
        },
      ],
    },
    {
      id: "t6",
      title: "Manager Enablement",
      description:
        "Managers need more support, clearer operating rituals, and better tools to translate strategy into weekly execution.",
      count: 15,
      percentage: 12,
      color: "blush",
      subthemes: ["Team Rituals", "Manager Tooling", "Execution Coaching"],
      quotes: [
        {
          id: 601,
          text: "Managers are doing translation work that should be easier and more consistent.",
        },
        {
          id: 602,
          text: "Better operating rhythms would reduce confusion for teams.",
        },
        {
          id: 603,
          text: "The strategy makes sense, but frontline execution support is thin.",
        },
      ],
    },
  ],
};
