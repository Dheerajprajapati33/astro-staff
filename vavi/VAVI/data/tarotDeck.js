// Comprehensive Tarot Card Deck with 100% Local Asset Imports

// Local Asset Imports
const TarotFool = require("../assets/images/Tarot_Fool.jpg");
const TarotMagician = require("../assets/images/Tarot_Magician.jpg");
const TarotHighPriestess = require("../assets/images/Tarot_High_Priestess.jpg");
const TarotEmpress = require("../assets/images/Tarot_Empress.jpg");
const TarotEmperor = require("../assets/images/Tarot_Emperor.jpg");
const TarotHierophant = require("../assets/images/Tarot_Hierophant.jpg");
const TarotLovers = require("../assets/images/Tarot_Lovers.jpg");
const TarotChariot = require("../assets/images/Tarot_Chariot.jpg");
const TarotStrength = require("../assets/images/Tarot_Strength.jpg");
const TarotHermit = require("../assets/images/Tarto_Nine_Hermit.png");
const TarotWheelOfFortune = require("../assets/images/Tarot_10_Wheel_of_Fortune.jpg");
const TarotJustice = require("../assets/images/Tarot_11_Justice.jpg");
const TarotHangedMan = require("../assets/images/Tarot_12_Hanged_Man.jpg");
const TarotDeath = require("../assets/images/Tarot_13_Death.jpg");
const TarotTemperance = require("../assets/images/Tarot_14_Temperance.jpg");
const TarotDevil = require("../assets/images/Tarot_Devil.jpg");
const TarotTower = require("../assets/images/Tarot_16_Tower.jpg");
const TarotStar = require("../assets/images/Tarot_17_Star.jpg");
const TarotMoon = require("../assets/images/Tarot_18_Moon.jpg");
const TarotSun = require("../assets/images/Tarot_19_Sun.jpg");
const TarotJudgement = require("../assets/images/Tarot_20_Judgement.jpg");
const TarotWorld = require("../assets/images/Tarot_21_World.jpg");
const QueenOfPentacles = require("../assets/images/Pents13.jpg");
const TenOfSwords = require("../assets/images/Tarot_Ten_of_Swords.jpg");
const PageOfSwords = require("../assets/images/Tarot_Page_of_Swords.jpg");
const AceOfCups = require("../assets/images/Tarot_Ace_of_Cups.jpg");
const ThreeOfWands = require("../assets/images/Wands03.jpg");
const FourOfPentacles = require("../assets/images/Pents04.jpg");
const SevenWands = require("../assets/images/seven-wands.png");
const EightCups = require("../assets/images/eight-cups.png");

export const TAROT_DECK = [
  {
    id: "fool",
    name: "The Fool",
    arcana: "Major",
    image: TarotFool,
    upright: {
      tag: "upright",
      keywords: ["New beginnings", "Innocence", "Spontaneity", "Free spirit"],
      meaning:
        "The Fool is a card of beginnings, innocence, spontaneity, and a free spirit. It encourages you to take a leap of faith into the unknown.",
      description:
        "You are on the verge of an unexpected journey or fresh life chapter. Trust your instincts, embrace pure curiosity, and let go of unnecessary worry.",
    },
    reversed: {
      tag: "reverse",
      keywords: ["Recklessness", "Risk-taking", "Hesitation", "Naivety"],
      meaning:
        "Reversed, The Fool suggests recklessness, uncalculated risks, or holding back out of fear. It might be a sign to think before you jump.",
      description:
        "Be mindful of impulsive decisions that lack foresight. Alternatively, check if fear of making mistakes is keeping you stuck.",
    },
  },
  {
    id: "magician",
    name: "The Magician",
    arcana: "Major",
    image: TarotMagician,
    upright: {
      tag: "upright",
      keywords: [
        "Manifestation",
        "Resourcefulness",
        "Power",
        "Inspired action",
      ],
      meaning:
        "The Magician is a card of manifestation, resourcefulness, power, and inspired action. You hold all the tools needed to succeed.",
      description:
        "Align your intention with dedicated effort. You have the inner talent, knowledge, and energy to bring your ideas into reality.",
    },
    reversed: {
      tag: "reverse",
      keywords: [
        "Illusion",
        "Untapped talents",
        "Misdirection",
        "Manipulation",
      ],
      meaning:
        "Reversed, The Magician can indicate untapped potential, self-doubt, or deceptive circumstances. You might be ignoring your own capabilities.",
      description:
        "Look closely at where you might be doubting your strengths or misusing your focus. Channel your energy with honesty and discipline.",
    },
  },
  {
    id: "high_priestess",
    name: "The High Priestess",
    arcana: "Major",
    image: TarotHighPriestess,
    upright: {
      tag: "upright",
      keywords: [
        "Intuition",
        "Sacred knowledge",
        "Subconscious",
        "Inner voice",
      ],
      meaning:
        "The High Priestess signifies deep intuition, mystery, and spiritual wisdom. Listen closely to your inner guidance.",
      description:
        "Pay attention to your gut feelings and dreams. Not everything needs immediate logical proof; trust the subtle whispers of your inner knowing.",
    },
    reversed: {
      tag: "reverse",
      keywords: [
        "Secrets",
        "Disconnected intuition",
        "Repression",
        "Superficiality",
      ],
      meaning:
        "Reversed, The High Priestess suggests ignoring your intuition or hiding behind secrets. It warns against superficial judgments.",
      description:
        "You may be ignoring signs your instincts are sending you. Take quiet time in meditation to reconnect with your truth.",
    },
  },
  {
    id: "empress",
    name: "The Empress",
    arcana: "Major",
    image: TarotEmpress,
    upright: {
      tag: "upright",
      keywords: ["Abundance", "Femininity", "Nurturing", "Creativity"],
      meaning:
        "The Empress embodies fertility, abundance, creative energy, and nurturing care. A fruitful and harmonious phase is unfolding.",
      description:
        "Step into kindness, comfort, and creative endeavors. Nurture yourself and those around you to let your projects blossom.",
    },
    reversed: {
      tag: "reverse",
      keywords: ["Creative block", "Dependence", "Neglect", "Overbearing"],
      meaning:
        "Reversed, The Empress points to creative blocks, feeling unappreciated, or neglecting personal wellbeing.",
      description:
        "Refill your own cup before pouring for others. Practice self-care and release feelings of self-sacrifice.",
    },
  },
  {
    id: "emperor",
    name: "The Emperor",
    arcana: "Major",
    image: TarotEmperor,
    upright: {
      tag: "upright",
      keywords: ["Authority", "Structure", "Stability", "Leadership"],
      meaning:
        "The Emperor brings structure, authority, discipline, and solid foundations. Take charge of your goals with confidence.",
      description:
        "Establish clear boundaries and organized plans. Your calm leadership and practical judgment will guide you through complexities.",
    },
    reversed: {
      tag: "reverse",
      keywords: ["Rigidity", "Control issues", "Lack of discipline", "Tyranny"],
      meaning:
        "Reversed, The Emperor warns against stubborn rigidity, excessive control, or a lack of personal discipline.",
      description:
        "Check if you are being too inflexible with yourself or others. True strength knows when to adapt.",
    },
  },
  {
    id: "hierophant",
    name: "The Hierophant",
    arcana: "Major",
    image: TarotHierophant,
    upright: {
      tag: "upright",
      keywords: ["Spiritual wisdom", "Tradition", "Mentorship", "Institutions"],
      meaning:
        "The Hierophant represents spiritual wisdom, proven traditions, and seeking guidance from experienced mentors.",
      description:
        "Follow established pathways and seek learning from trusted teachers. Honour your values and core community principles.",
    },
    reversed: {
      tag: "reverse",
      keywords: [
        "Rebellion",
        "Unconventional beliefs",
        "Rigid dogma",
        "New methods",
      ],
      meaning:
        "Reversed, The Hierophant suggests questioning outdated rules, breaking free from dogma, or creating your own path.",
      description:
        "You may feel compelled to challenge traditional expectations. Forge an authentic approach that matches your personal truth.",
    },
  },
  {
    id: "lovers",
    name: "The Lovers",
    arcana: "Major",
    image: TarotLovers,
    upright: {
      tag: "upright",
      keywords: ["Love", "Harmony", "Relationships", "Values alignment"],
      meaning:
        "The Lovers represents meaningful connections, deep harmony, and critical life choices aligned with your values.",
      description:
        "Celebrate genuine partnership and open communication. Ensure that choices you make reflect what you value most.",
    },
    reversed: {
      tag: "reverse",
      keywords: ["Disharmony", "Misalignment", "Conflict", "Indecision"],
      meaning:
        "Reversed, The Lovers indicates relationship friction, misaligned goals, or struggles with an important moral dilemma.",
      description:
        "Reflect on where communication is breaking down. Restore inner balance before committing to mutual agreements.",
    },
  },
  {
    id: "chariot",
    name: "The Chariot",
    arcana: "Major",
    image: TarotChariot,
    upright: {
      tag: "upright",
      keywords: ["Determination", "Willpower", "Victory", "Focus"],
      meaning:
        "The Chariot symbolizes triumph through willpower, focused drive, and overcoming opposing forces.",
      description:
        "Stay dedicated to your mission. By balancing conflicting energies with discipline, you will accelerate towards victory.",
    },
    reversed: {
      tag: "reverse",
      keywords: [
        "Lack of direction",
        "Aggression",
        "Loss of control",
        "Obstacles",
      ],
      meaning:
        "Reversed, The Chariot points to feeling powerless, scattered focus, or being driven off course by impatience.",
      description:
        "Take your foot off the pedal for a moment. Regain clarity of direction rather than forcing outcomes impatiently.",
    },
  },
  {
    id: "strength",
    name: "Strength",
    arcana: "Major",
    image: TarotStrength,
    upright: {
      tag: "upright",
      keywords: ["Courage", "Compassion", "Patience", "Inner resilience"],
      meaning:
        "Strength represents quiet courage, gentle patience, and mastering raw emotion through compassionate resilience.",
      description:
        "Lead with kindness rather than brute force. Your quiet inner confidence and endurance will overcome any obstacle.",
    },
    reversed: {
      tag: "reverse",
      keywords: ["Self-doubt", "Weakness", "Insecurity", "Raw emotions"],
      meaning:
        "Reversed, Strength indicates vulnerable moments of self-doubt, feeling drained, or struggling to manage temper.",
      description:
        "Remember that true strength includes forgiving yourself and accepting your vulnerabilities without shame.",
    },
  },
  {
    id: "hermit",
    name: "The Hermit",
    arcana: "Major",
    image: TarotHermit,
    upright: {
      tag: "upright",
      keywords: [
        "Soul-searching",
        "Introspection",
        "Solitude",
        "Inner guidance",
      ],
      meaning:
        "The Hermit calls for quiet introspection, soul-searching, and shedding outer noise to find your inner light.",
      description:
        "Step back from busy social demands. Solitude will illuminate the right answers and clarify your future steps.",
    },
    reversed: {
      tag: "reverse",
      keywords: ["Isolation", "Loneliness", "Withdrawal", "Anti-social"],
      meaning:
        "Reversed, The Hermit warns against excessive isolation, feeling lonely, or shutting out supportive loved ones.",
      description:
        "Do not let self-reflection turn into complete isolation. Reach out to someone you trust for warmth and perspective.",
    },
  },
  {
    id: "wheel_of_fortune",
    name: "Wheel of Fortune",
    arcana: "Major",
    image: TarotWheelOfFortune,
    upright: {
      tag: "upright",
      keywords: ["Good luck", "Karma", "Destiny", "Life cycles"],
      meaning:
        "The Wheel of Fortune signals positive turning points, karmic destiny, and beneficial cycles shifting in your favor.",
      description:
        "Life is entering a dynamic cycle of opportunity. Stay optimistic, adaptable, and ready to seize auspicious moments.",
    },
    reversed: {
      tag: "reverse",
      keywords: [
        "Bad luck",
        "Resistance to change",
        "Setbacks",
        "Unwelcome shifts",
      ],
      meaning:
        "Reversed, The Wheel of Fortune suggests temporary setbacks, unexpected delays, or resisting unavoidable changes.",
      description:
        "Understand that lows are naturally followed by highs. Flow with changes instead of resisting them.",
    },
  },
  {
    id: "justice",
    name: "Justice",
    arcana: "Major",
    image: TarotJustice,
    upright: {
      tag: "upright",
      keywords: ["Fairness", "Truth", "Karma", "Accountability"],
      meaning:
        "Justice represents moral fairness, clear truth, ethical decisions, and receiving balanced karmic rewards.",
      description:
        "Evaluate your choices with complete honesty. Fairness, integrity, and truthful dealings will lead to favorable resolutions.",
    },
    reversed: {
      tag: "reverse",
      keywords: [
        "Dishonesty",
        "Unfair treatment",
        "Lack of accountability",
        "Bias",
      ],
      meaning:
        "Reversed, Justice points to perceived unfairness, avoiding accountability, or biased judgments.",
      description:
        "Examine if you are being entirely fair with yourself and others. Take responsibility for your part in ongoing situations.",
    },
  },
  {
    id: "hanged_man",
    name: "The Hanged Man",
    arcana: "Major",
    image: TarotHangedMan,
    upright: {
      tag: "upright",
      keywords: ["Pause", "Surrender", "New perspective", "Letting go"],
      meaning:
        "The Hanged Man urges you to pause, release stubborn control, and view current circumstances from a completely new angle.",
      description:
        "A temporary suspension brings enlightenment. Surrender the urge to force outcomes; patience will unveil better solutions.",
    },
    reversed: {
      tag: "reverse",
      keywords: ["Delays", "Resistance", "Stalling", "Pointless sacrifice"],
      meaning:
        "Reversed, The Hanged Man suggests needless stalling, martyr complexes, or resisting productive progress.",
      description:
        "Stop putting off decisions. Recognize whether waiting is truly serving you or simply masking procrastination.",
    },
  },
  {
    id: "death",
    name: "Death",
    arcana: "Major",
    image: TarotDeath,
    upright: {
      tag: "upright",
      keywords: ["Transformation", "Endings", "New beginnings", "Transition"],
      meaning:
        "Death represents powerful transformation, closure of old phases, and making space for meaningful new beginnings.",
      description:
        "Release what no longer serves your growth. Every ending plants the seeds for revitalized opportunities.",
    },
    reversed: {
      tag: "reverse",
      keywords: ["Fear of change", "Holding on", "Stagnation", "Decay"],
      meaning:
        "Reversed, Death highlights clinging to the past, fear of letting go, and stagnation from resisting change.",
      description:
        "Holding onto expired situations delays your renewal. Have courage to let the old chapter close gracefully.",
    },
  },
  {
    id: "temperance",
    name: "Temperance",
    arcana: "Major",
    image: TarotTemperance,
    upright: {
      tag: "upright",
      keywords: ["Balance", "Moderation", "Patience", "Purpose"],
      meaning:
        "Temperance brings harmony, emotional balance, patience, and synthesizing opposites into a peaceful flow.",
      description:
        "Practice moderation in actions and speech. A steady, calm, and balanced approach ensures long-term peace.",
    },
    reversed: {
      tag: "reverse",
      keywords: ["Imbalance", "Excess", "Impatience", "Extremes"],
      meaning:
        "Reversed, Temperance points to lifestyle extremes, emotional agitation, or reckless overindulgence.",
      description:
        "Step back and identify where excess is throwing off your equilibrium. Strive for calm and centered moderation.",
    },
  },
  {
    id: "devil",
    name: "The Devil",
    arcana: "Major",
    image: TarotDevil,
    upright: {
      tag: "upright",
      keywords: ["Attachment", "Addiction", "Shadow self", "Material bonds"],
      meaning:
        "The Devil highlights unhealthy attachments, compulsive habits, and feeling trapped by limiting beliefs.",
      description:
        "Recognize that chains are often self-imposed illusions. Awareness is the first step towards breaking free and reclaiming sovereignty.",
    },
    reversed: {
      tag: "reverse",
      keywords: ["Freedom", "Release", "Overcoming addiction", "Empowerment"],
      meaning:
        "Reversed, The Devil signals liberation, breaking negative patterns, and reclaiming your personal freedom.",
      description:
        "You are shedding toxic cycles and regaining control. Keep shedding old bondages to step into true vitality.",
    },
  },
  {
    id: "tower",
    name: "The Tower",
    arcana: "Major",
    image: TarotTower,
    upright: {
      tag: "upright",
      keywords: ["Sudden change", "Upheaval", "Awakening", "Revelation"],
      meaning:
        "The Tower brings sudden awakenings, dismantling illusions to clear the ground for honest rebuilding.",
      description:
        "Though unexpected shake-ups can feel jarring, they strip away falsehoods to establish enduring authenticity.",
    },
    reversed: {
      tag: "reverse",
      keywords: [
        "Averting disaster",
        "Delaying inevitable",
        "Fear of suffering",
      ],
      meaning:
        "Reversed, The Tower points to narrowly averting crisis or prolonging inevitable structural transformations.",
      description:
        "Do not attempt to patch up foundations that are no longer viable. Embrace the reset with optimism.",
    },
  },
  {
    id: "star",
    name: "The Star",
    arcana: "Major",
    image: TarotStar,
    upright: {
      tag: "upright",
      keywords: ["Hope", "Faith", "Inspiration", "Healing"],
      meaning:
        "The Star radiates hope, deep emotional healing, peaceful inspiration, and renewed faith in your future.",
      description:
        "A soothing sense of clarity and spiritual guidance surrounds you. Trust that the universe is supporting your journey.",
    },
    reversed: {
      tag: "reverse",
      keywords: ["Hopelessness", "Despair", "Discouragement", "Pessimism"],
      meaning:
        "Reversed, The Star reflects temporary disillusionment, low energy, or feeling disconnected from your dreams.",
      description:
        "Reconnect with small joys and gentle routines. Hope is not gone; it is simply waiting for you to nurture it.",
    },
  },
  {
    id: "moon",
    name: "The Moon",
    arcana: "Major",
    image: TarotMoon,
    upright: {
      tag: "upright",
      keywords: ["Illusion", "Fear", "Anxiety", "Subconscious instincts"],
      meaning:
        "The Moon reflects hidden depths, illusions, anxiety, and navigating moments when things are not as they seem.",
      description:
        "Do not rush into major commitments while clarity is clouded. Let things settle and rely on intuitive discernment.",
    },
    reversed: {
      tag: "reverse",
      keywords: [
        "Release of fear",
        "Unveiling secrets",
        "Clarity",
        "Truth revealed",
      ],
      meaning:
        "Reversed, The Moon brings the lifting of confusion, dissipation of unfounded fears, and emerging clarity.",
      description:
        "Shadows and misunderstandings are clearing away. Truth is surfacing, allowing you to move forward with peace.",
    },
  },
  {
    id: "sun",
    name: "The Sun",
    arcana: "Major",
    image: TarotSun,
    upright: {
      tag: "upright",
      keywords: ["Joy", "Success", "Celebration", "Positivity"],
      meaning:
        "The Sun radiates vibrant joy, clarity, vitality, abundance, and triumphant success across all endeavors.",
      description:
        "Expect warm energy, positivity, and uplifting achievements. Your authentic radiance inspires and illuminates everyone around you.",
    },
    reversed: {
      tag: "reverse",
      keywords: [
        "Temporary sadness",
        "Blocked joy",
        "Overly optimistic",
        "Delayed success",
      ],
      meaning:
        "Reversed, The Sun indicates slight clouds obscuring your joy or temporary delays in celebrations.",
      description:
        "Look on the bright side without ignoring practical realities. Joy is within reach once you clear minor self-doubts.",
    },
  },
  {
    id: "judgement",
    name: "Judgement",
    arcana: "Major",
    image: TarotJudgement,
    upright: {
      tag: "upright",
      keywords: ["Reckoning", "Awakening", "Life purpose", "Forgiveness"],
      meaning:
        "Judgement signals a profound spiritual awakening, life-defining choices, and stepping up to your higher calling.",
      description:
        "Release past regrets with self-forgiveness. You are called to a higher purpose and renewed clarity of path.",
    },
    reversed: {
      tag: "reverse",
      keywords: [
        "Self-doubt",
        "Harsh self-criticism",
        "Ignoring call",
        "Guilt",
      ],
      meaning:
        "Reversed, Judgement warns against debilitating self-criticism, lingering guilt, or ignoring essential life calls.",
      description:
        "Stop punishing yourself for previous chapters. Grant yourself grace and step forward with confidence.",
    },
  },
  {
    id: "world",
    name: "The World",
    arcana: "Major",
    image: TarotWorld,
    upright: {
      tag: "upright",
      keywords: ["Completion", "Wholeness", "Accomplishment", "Travel"],
      meaning:
        "The World marks fulfilling completion, holistic achievement, ultimate harmony, and successful milestones.",
      description:
        "A major life cycle is coming to a triumphant and satisfying conclusion. Celebrate your journey and wholeness.",
    },
    reversed: {
      tag: "reverse",
      keywords: ["Incompletion", "Lack of closure", "Shortcuts", "Empty goals"],
      meaning:
        "Reversed, The World points to unfinished business, delayed closure, or feeling unfulfilled despite reaching goals.",
      description:
        "Tie up remaining loose ends before leaping into new commitments. Meaningful closure brings genuine peace.",
    },
  },
  {
    id: "queen_of_pentacles",
    name: "Queen of Pentacles",
    arcana: "Minor",
    suit: "Pentacles",
    image: QueenOfPentacles,
    upright: {
      tag: "upright",
      keywords: [
        "Nurturing",
        "Practical abundance",
        "Comfort",
        "Financial wisdom",
      ],
      meaning:
        "The Queen of Pentacles represents practical care, domestic warmth, financial stability, and grounded generosity.",
      description:
        "You are in a position of providing security and comfort. Channel resourcefulness into caring for your home and finances.",
    },
    reversed: {
      tag: "reverse",
      keywords: ["Imbalance", "Work-life strain", "Neglect", "Material worry"],
      meaning:
        "Reversed, the Queen of Pentacles can indicate imbalance or neglect. It might be a sign that you need to focus on self-care.",
      description:
        "You may be feeling overwhelmed by domestic or financial burdens. Restore balance between giving to others and nurturing yourself.",
    },
  },
  {
    id: "ten_of_swords",
    name: "Ten of Swords",
    arcana: "Minor",
    suit: "Swords",
    image: TenOfSwords,
    upright: {
      tag: "upright",
      keywords: [
        "Painful ending",
        "Betrayal",
        "Hitting bottom",
        "Inevitable conclusion",
      ],
      meaning:
        "The Ten of Swords marks a painful ending or reaching rock bottom, but with the guarantee that the worst is now behind you.",
      description:
        "Allow the finality of the situation to bring relief. Dawn is arriving on the horizon; healing begins now.",
    },
    reversed: {
      tag: "reverse",
      keywords: ["Recovery", "Regeneration", "Rising above", "Healing wounds"],
      meaning:
        "Reversed, the Ten of Swords can indicate recovery and regeneration. It might be a sign that you are starting to heal.",
      description:
        "You are emerging from a heavy ordeal. The pain of the past is losing its grip, making way for genuine renewal.",
    },
  },
  {
    id: "page_of_swords",
    name: "Page of Swords",
    arcana: "Minor",
    suit: "Swords",
    image: PageOfSwords,
    upright: {
      tag: "upright",
      keywords: ["Curiosity", "New ideas", "Mental agility", "Truth-seeker"],
      meaning:
        "The Page of Swords is a card of curiosity and new ideas. Upright, it signifies energetic exploration and mental agility.",
      description:
        "You possess sharp mental focus and eager enthusiasm to learn. Express your thoughts with clarity and truthful passion.",
    },
    reversed: {
      tag: "reverse",
      keywords: ["Deception", "Gossip", "All talk no action", "Defensiveness"],
      meaning:
        "Reversed, the Page of Swords warns against sharp tongue, unverified rumors, or scattering ideas without follow-through.",
      description:
        "Ensure your words build rather than wound. Verify facts carefully before leaping to premature conclusions.",
    },
  },
  {
    id: "ace_of_cups",
    name: "Ace of Cups",
    arcana: "Minor",
    suit: "Cups",
    image: AceOfCups,
    upright: {
      tag: "upright",
      keywords: ["Love", "New feelings", "Emotional flow", "Compassion"],
      meaning:
        "The Ace of Cups represents overflowing love, emotional renewal, deep compassion, and heart-centered opportunities.",
      description:
        "Open your heart to fresh relationships, creative inspiration, and joyful feelings that restore your spirit.",
    },
    reversed: {
      tag: "reverse",
      keywords: ["Emotional drain", "Blocked feelings", "Repressed hurt"],
      meaning:
        "Reversed, the Ace of Cups points to emotional fatigue, vulnerability fears, or withholding feelings from yourself.",
      description:
        "Give yourself permission to feel without judgment. Emotional clearing opens space for new love and creative joy.",
    },
  },
  {
    id: "seven_of_wands",
    name: "Seven of Wands",
    arcana: "Minor",
    suit: "Wands",
    image: SevenWands,
    upright: {
      tag: "upright",
      keywords: [
        "Perseverance",
        "Defensiveness",
        "Maintaining control",
        "Courage",
      ],
      meaning:
        "The Seven of Wands represents standing your ground, defending your position, and overcoming overwhelming competition.",
      description:
        "Hold your convictions firmly. Even if challenged from multiple sides, your elevated position gives you the advantage.",
    },
    reversed: {
      tag: "reverse",
      keywords: ["Giving up", "Overwhelmed", "Exhaustion", "Admitting defeat"],
      meaning:
        "Reversed, the Seven of Wands suggests feeling overwhelmed by constant pressure or picking unnecessary battles.",
      description:
        "Conserve your energy. Discern which battles are worth fighting and where compromise brings peace.",
    },
  },
  {
    id: "eight_of_cups",
    name: "Eight of Cups",
    arcana: "Minor",
    suit: "Cups",
    image: EightCups,
    upright: {
      tag: "upright",
      keywords: [
        "Walking away",
        "Disillusionment",
        "Leaving behind",
        "Seeking truth",
      ],
      meaning:
        "The Eight of Cups marks walking away from situations that no longer fulfill you to seek a deeper spiritual purpose.",
      description:
        "It takes courage to walk away from the familiar. Honor your inner journey towards greater fulfillment.",
    },
    reversed: {
      tag: "reverse",
      keywords: [
        "Stagnation",
        "Fear of moving on",
        "Clinging to the past",
        "Aimless drifting",
      ],
      meaning:
        "Reversed, the Eight of Cups points to fear of change, staying in unfulfilling situations, or aimless wandering.",
      description:
        "Acknowledge what is no longer serving your soul. Taking the first step forward clears the path to renewal.",
    },
  },
  {
    id: "three_of_wands",
    name: "Three of Wands",
    arcana: "Minor",
    suit: "Wands",
    image: ThreeOfWands,
    upright: {
      tag: "upright",
      keywords: [
        "Expansion",
        "Foresight",
        "Overseas opportunities",
        "Progress",
      ],
      meaning:
        "The Three of Wands signals expansion, looking ahead with visionary confidence, and seeing plans begin to pay off.",
      description:
        "Your efforts are gaining momentum. Cast your gaze further and embrace opportunities that broaden your horizon.",
    },
    reversed: {
      tag: "reverse",
      keywords: [
        "Delays",
        "Obstacles",
        "Disappointment in results",
        "Restricted view",
      ],
      meaning:
        "Reversed, the Three of Wands warns of delays in long-term plans or hesitation to explore broader opportunities.",
      description:
        "Review your strategy if hurdles arise. Refine your logistics and maintain faith in long-term growth.",
    },
  },
  {
    id: "four_of_pentacles",
    name: "Four of Pentacles",
    arcana: "Minor",
    suit: "Pentacles",
    image: FourOfPentacles,
    upright: {
      tag: "upright",
      keywords: ["Security", "Frugality", "Possessiveness", "Control"],
      meaning:
        "The Four of Pentacles speaks of financial security and boundaries, but cautions against clinging too tightly out of fear.",
      description:
        "Protecting your resources is prudent, but beware of scarcity mindset. Allow energy and abundance to circulate.",
    },
    reversed: {
      tag: "reverse",
      keywords: [
        "Generosity",
        "Reckless spending",
        "Letting go",
        "Financial risk",
      ],
      meaning:
        "Reversed, the Four of Pentacles points to releasing tight control or, conversely, reckless spending impulses.",
      description:
        "Find the sweet spot between stinginess and carelessness. Wealth flows best when managed with calm discernment.",
    },
  },
];

/**
 * Find local tarot card data by name or ID
 */
export function findTarotCardByName(cardName) {
  if (!cardName) return null;
  const normalized = cardName.toLowerCase().trim();
  const stripped = normalized.replace(/^the\s+/, "");

  return TAROT_DECK.find((card) => {
    const cNorm = card.name.toLowerCase().trim();
    const cStripped = cNorm.replace(/^the\s+/, "");
    const cId = card.id.toLowerCase().replace(/_/g, " ");
    return (
      cNorm === normalized ||
      cStripped === stripped ||
      cId === stripped ||
      cId === normalized ||
      normalized.includes(cStripped) ||
      cNorm.includes(stripped)
    );
  });
}

/**
 * Randomly draws `count` unique cards from local deck
 * with 50/50 probability for upright vs reverse orientation.
 */
export function drawRandomTarotCards(count = 3) {
  const shuffled = [...TAROT_DECK].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, count);

  return selected.map((card) => {
    const isReversed = Math.random() > 0.5;
    const orientation = isReversed ? "reverse" : "upright";
    const data = isReversed ? card.reversed : card.upright;

    return {
      id: card.id,
      name: card.name,
      arcana: card.arcana,
      image: card.image,
      orientation: orientation,
      isReversed: isReversed,
      keywords: data.keywords,
      meaning: data.meaning,
      description: data.description,
    };
  });
}
