export interface SurveyOption {
  value: string;
  label: string;
  mutuallyExclusive?: boolean;
  hasOtherInput?: boolean;
}

export interface SurveyQuestion {
  id: string;
  section: "about-you" | "breakfast" | "lunch" | "your-meals" | "your-ideas";
  type:
    | "grade"
    | "three-point"
    | "frequency"
    | "dietary"
    | "multi-select"
    | "open-ended";
  question: string;
  helper?: string;
  privacyNote?: string;
  anonymityReminder?: string;
  maxLength?: number;
  options?: SurveyOption[];
  dependsOn?: {
    questionId: string;
    condition: "less-than" | "equals" | "eats-school-meals";
    value: number;
  };
}

export interface SurveyInstrument {
  gradeBand: "K-5" | "6-8" | "9-12";
  gradeBandDisplay: string;
  gradeOptions: { value: string; label: string }[];
  questions: SurveyQuestion[];
}

export interface SectionIntro {
  title: string;
  subtitle: string;
}

export const surveyInstruments: Record<string, SurveyInstrument> = {
  "K-5": {
    gradeBand: "K-5",
    gradeBandDisplay: "Grades K\u20135",
    gradeOptions: [
      { value: "K", label: "Kindergarten" },
      { value: "1", label: "1st grade" },
      { value: "2", label: "2nd grade" },
      { value: "3", label: "3rd grade" },
      { value: "4", label: "4th grade" },
      { value: "5", label: "5th grade" },
    ],
    questions: [
      {
        id: "k5-grade",
        section: "about-you",
        type: "grade",
        question: "What grade are you in?",
        helper: "Tap your grade.",
        privacyNote:
          "This is the only thing we ask about you \u2014 and it stays anonymous.",
      },
      {
        id: "k5-breakfast-freq",
        section: "breakfast",
        type: "frequency",
        question: "I eat school breakfast ___ days a week.",
        helper: "Pick one.",
      },
      {
        id: "k5-breakfast-why-not",
        section: "breakfast",
        type: "multi-select",
        question: "Why don't you eat school breakfast?",
        helper: "Pick all that apply.",
        options: [
          { value: "eat-home", label: "I eat breakfast at home" },
          { value: "not-like", label: "I do not like the food" },
          { value: "not-hungry", label: "I am not hungry" },
          { value: "line-long", label: "The lunch line is too long" },
          { value: "no-time", label: "I do not have enough time to eat" },
          {
            value: "allergies",
            label: "I have food allergies or special food needs",
          },
          { value: "too-expensive", label: "Breakfast is too expensive" },
          { value: "other", label: "Other", hasOtherInput: true },
        ],
        dependsOn: {
          questionId: "k5-breakfast-freq",
          condition: "equals",
          value: 0,
        },
      },
      {
        id: "k5-breakfast-instead",
        section: "breakfast",
        type: "multi-select",
        question: "What do you usually do during breakfast instead?",
        helper: "Pick all that apply.",
        options: [
          { value: "eat-snack", label: "Eat a snack" },
          { value: "share-food", label: "Share food with a friend" },
          { value: "other", label: "Other", hasOtherInput: true },
        ],
        dependsOn: {
          questionId: "k5-breakfast-freq",
          condition: "equals",
          value: 0,
        },
      },
      {
        id: "k5-breakfast-help",
        section: "breakfast",
        type: "multi-select",
        question: "What would help you eat school lunch?",
        helper: "Pick all that apply.",
        dependsOn: {
          questionId: "k5-breakfast-freq",
          condition: "equals",
          value: 0,
        },
        options: [
          { value: "more-foods", label: "More foods I like" },
          { value: "more-choices", label: "More choices each day" },
          {
            value: "shorter-breakfast-lines",
            label: "Shorter breakfast lines",
          },
          { value: "more-time", label: "More time to eat" },
          { value: "healthier", label: "Healthier foods" },
          {
            value: "nothing",
            label: "Nothing would change my mind",
            mutuallyExclusive: true,
          },
        ],
      },
      {
        id: "k5-lunch-freq",
        section: "lunch",
        type: "frequency",
        question: "I eat school lunch ___ days a week.",
        helper: "Pick one.",
      },
      {
        id: "k5-lunch-why-not",
        section: "lunch",
        type: "multi-select",
        question: "Why don't you eat school lunch?",
        helper: "Pick all that apply.",
        options: [
          { value: "bring-home", label: "I bring lunch from home" },
          { value: "not-like", label: "I do not like the food" },
          { value: "not-hungry", label: "I am not hungry" },
          { value: "line-long", label: "The lunch line is too long" },
          { value: "no-time", label: "I do not have enough time to eat" },
          {
            value: "allergies",
            label: "I have food allergies or special food needs",
          },
          { value: "too-expensive", label: "Lunch is too expensive" },
          { value: "other", label: "Other", hasOtherInput: true },
        ],
        dependsOn: {
          questionId: "k5-lunch-freq",
          condition: "equals",
          value: 0,
        },
      },
      {
        id: "k5-lunch-instead",
        section: "lunch",
        type: "multi-select",
        question: "What do you usually do during lunch instead?",
        helper: "Pick all that apply.",
        options: [
          { value: "lunch-from-home", label: "Eat lunch from home" },
          { value: "eat-snack", label: "Eat a snack" },
          { value: "wait-home", label: "Wait until I get home to eat" },
          { value: "share-food", label: "Share food with a friend" },
          { value: "other", label: "Other", hasOtherInput: true },
        ],
        dependsOn: {
          questionId: "k5-lunch-freq",
          condition: "equals",
          value: 0,
        },
      },
      {
        id: "k5-lunch-help",
        section: "lunch",
        type: "multi-select",
        question: "What would help you eat school lunch?",
        helper: "Pick all that apply.",
        dependsOn: {
          questionId: "k5-lunch-freq",
          condition: "equals",
          value: 0,
        },
        options: [
          { value: "more-foods", label: "More foods I like" },
          { value: "more-choices", label: "More choices each day" },
          { value: "shorter-lunch-lines", label: "Shorter lunch lines" },
          { value: "more-time", label: "More time to eat" },
          { value: "healthier", label: "Healthier foods" },
          {
            value: "nothing",
            label: "Nothing would change my mind",
            mutuallyExclusive: true,
          },
        ],
      },
      {
        id: "k5-meals-taste-good",
        section: "your-meals",
        type: "three-point",
        question: "The food tastes good.",
      },
      {
        id: "k5-meals-looks-yummy",
        section: "your-meals",
        type: "three-point",
        question: "The food looks yummy when I get it.",
      },
      {
        id: "k5-meals-fresh-fruit-veg",
        section: "your-meals",
        type: "three-point",
        question:
          "The fruits and vegetables included with the school food look fresh.",
      },
      {
        id: "k5-meals-different-weekly",
        section: "your-meals",
        type: "three-point",
        question: "There are different foods to choose from each week.",
      },
      {
        id: "k5-meals-feel-full",
        section: "your-meals",
        type: "three-point",
        question: "After eating a school meal, I feel full.",
      },
      {
        id: "k5-meals-staff-friendly",
        section: "your-meals",
        type: "three-point",
        question: "The people who serve the food are friendly.",
      },
      {
        id: "k5-meals-cafeteria-clean",
        section: "your-meals",
        type: "three-point",
        question: "The cafeteria is clean.",
      },
      {
        id: "k5-meals-line-fast",
        section: "your-meals",
        type: "three-point",
        question: "The lunch line moves fast.",
      },
      {
        id: "k5-meals-enough-time",
        section: "your-meals",
        type: "three-point",
        question: "I have enough time to eat my food.",
      },
      {
        id: "k5-meals-temperature",
        section: "your-meals",
        type: "three-point",
        question: "The food is warm or cold like it should be.",
      },
      {
        id: "k5-meals-try-new",
        section: "your-meals",
        type: "three-point",
        question: "I like trying new foods at school.",
      },
      {
        id: "k5-ideas-favorite",
        section: "your-ideas",
        type: "open-ended",
        question: "What is your favorite school meal?",
        helper:
          "Write as much or as little as you want. There are no wrong answers.",
        anonymityReminder: "Please don't type your name or anyone else's.",
        maxLength: 10,
      },
      {
        id: "k5-ideas-more-of",
        section: "your-ideas",
        type: "multi-select",
        question:
          "What kind of food would you like to see more of on the school menu?",
        helper: "Pick all that apply.",
        options: [
          { value: "italian", label: "Italian (pizza, pasta, red sauce)" },
          { value: "mexican", label: "Mexican (nachos, tacos)" },
          { value: "asian", label: "Asian (stir-fry, orange chicken)" },
          {
            value: "american",
            label: "American (chicken nuggets, hot dogs, hamburgers)",
          },
          {
            value: "southern",
            label: "Southern (chicken and waffles, gumbo, red beans and rice)",
          },
          {
            value: "healthier",
            label: "Healthier options (salad, cut fruit, cut veggies)",
          },
          { value: "other", label: "Other", hasOtherInput: true },
        ],
      },
    ],
  },
  "6-8": {
    gradeBand: "6-8",
    gradeBandDisplay: "Grades 6\u20138",
    gradeOptions: [
      { value: "6", label: "6th grade" },
      { value: "7", label: "7th grade" },
      { value: "8", label: "8th grade" },
    ],
    questions: [
      {
        id: "ms-grade",
        section: "about-you",
        type: "grade",
        question: "What grade are you in?",
        helper: "Select your grade.",
        privacyNote: "This is the only thing we collect about you.",
      },
      {
        id: "ms-breakfast-freq",
        section: "breakfast",
        type: "frequency",
        question: "I eat school breakfast ____ days per week.",
        helper: "Select one.",
      },
      {
        id: "ms-breakfast-why-not",
        section: "breakfast",
        type: "multi-select",
        question: "Why don't you eat school breakfast?",
        helper: "Select all that apply.",
        options: [
          { value: "eat-home", label: "I eat breakfast at home" },
          { value: "not-like", label: "I do not like the food" },
          { value: "not-hungry", label: "I am not hungry" },
          { value: "line-long", label: "The lunch line is too long" },
          { value: "no-time", label: "I do not have enough time to eat" },
          {
            value: "allergies",
            label: "I have food allergies or special food needs",
          },
          { value: "too-expensive", label: "Breakfast is too expensive" },
          { value: "other", label: "Other", hasOtherInput: true },
        ],
        dependsOn: {
          questionId: "ms-breakfast-freq",
          condition: "equals",
          value: 0,
        },
      },
      {
        id: "ms-breakfast-instead",
        section: "breakfast",
        type: "multi-select",
        question: "What do you usually do during breakfast instead?",
        helper: "Select all that apply.",
        options: [
          { value: "eat-snack", label: "Eat a snack" },
          { value: "share-food", label: "Share food with a friend" },
          { value: "other", label: "Other", hasOtherInput: true },
        ],
        dependsOn: {
          questionId: "ms-breakfast-freq",
          condition: "equals",
          value: 0,
        },
      },
      {
        id: "ms-breakfast-help",
        section: "breakfast",
        type: "multi-select",
        question: "What would help you eat school lunch?",
        helper: "Select all that apply.",
        dependsOn: {
          questionId: "ms-breakfast-freq",
          condition: "equals",
          value: 0,
        },
        options: [
          { value: "more-foods", label: "More foods I like" },
          { value: "more-choices", label: "More choices each day" },
          {
            value: "shorter-breakfast-lines",
            label: "Shorter breakfast lines",
          },
          { value: "more-time", label: "More time to eat" },
          { value: "healthier", label: "Healthier foods" },
          {
            value: "nothing",
            label: "Nothing would change my mind",
            mutuallyExclusive: true,
          },
        ],
      },
      {
        id: "ms-lunch-freq",
        section: "lunch",
        type: "frequency",
        question: "I eat school lunch _____ days per week.",
        helper: "Select one.",
      },
      {
        id: "ms-lunch-why-not",
        section: "lunch",
        type: "multi-select",
        question: "Why don't you eat school lunch?",
        helper: "Select all that apply.",
        options: [
          { value: "bring-home", label: "I bring lunch from home" },
          { value: "not-like", label: "I do not like the food" },
          { value: "not-hungry", label: "I am not hungry" },
          { value: "line-long", label: "The lunch line is too long" },
          { value: "no-time", label: "I do not have enough time to eat" },
          {
            value: "allergies",
            label: "I have food allergies or special food needs",
          },
          { value: "too-expensive", label: "Lunch is too expensive" },
          { value: "other", label: "Other", hasOtherInput: true },
        ],
        dependsOn: {
          questionId: "ms-lunch-freq",
          condition: "equals",
          value: 0,
        },
      },
      {
        id: "ms-lunch-instead",
        section: "lunch",
        type: "multi-select",
        question: "What do you usually do during lunch instead?",
        helper: "Select all that apply.",
        options: [
          { value: "lunch-from-home", label: "Eat lunch from home" },
          { value: "eat-snack", label: "Eat a snack" },
          { value: "wait-home", label: "Wait until I get home to eat" },
          { value: "share-food", label: "Share food with a friend" },
          { value: "other", label: "Other", hasOtherInput: true },
        ],
        dependsOn: {
          questionId: "ms-lunch-freq",
          condition: "equals",
          value: 0,
        },
      },
      {
        id: "ms-lunch-help",
        section: "lunch",
        type: "multi-select",
        question: "What would help you eat school lunch?",
        helper: "Select all that apply.",
        dependsOn: {
          questionId: "ms-lunch-freq",
          condition: "equals",
          value: 0,
        },
        options: [
          { value: "more-foods", label: "More foods I like" },
          { value: "more-choices", label: "More choices each day" },
          { value: "shorter-lunch-lines", label: "Shorter lunch lines" },
          { value: "more-time", label: "More time to eat" },
          { value: "healthier", label: "Healthier foods" },
          {
            value: "nothing",
            label: "Nothing would change my mind",
            mutuallyExclusive: true,
          },
        ],
      },
      {
        id: "ms-meals-taste-good",
        section: "your-meals",
        type: "three-point",
        question: "The food tastes good most days.",
      },
      {
        id: "ms-meals-fresh-fruit-veg",
        section: "your-meals",
        type: "three-point",
        question: "The fruits and vegetables look fresh.",
      },
      {
        id: "ms-meals-milk-cold",
        section: "your-meals",
        type: "three-point",
        question: "The milk is served cold and fresh.",
      },
      {
        id: "ms-meals-temperature",
        section: "your-meals",
        type: "three-point",
        question:
          "Meals are served at the right temperature (hot foods hot, cold foods cold).",
      },
      {
        id: "ms-meals-different-weekly",
        section: "your-meals",
        type: "three-point",
        question: "There are different options on the menu each week.",
      },
      {
        id: "ms-meals-enough-choices",
        section: "your-meals",
        type: "three-point",
        question: "There are enough choices on the menu each day.",
      },
      {
        id: "ms-meals-feel-full",
        section: "your-meals",
        type: "three-point",
        question: "After eating a school meal, I feel full.",
      },
      {
        id: "ms-meals-nutritious",
        section: "your-meals",
        type: "three-point",
        question: "The meals are nutritious.",
      },
      {
        id: "ms-meals-dietary",
        section: "your-meals",
        type: "dietary",
        question:
          "If I have a dietary restriction, the school menu caters to my needs (allergy, cultural, religious etc.)",
        helper: "Select one.",
      },
      {
        id: "ms-meals-staff-friendly",
        section: "your-meals",
        type: "three-point",
        question: "The cafeteria staff are friendly and welcoming.",
      },
      {
        id: "ms-meals-enough-time",
        section: "your-meals",
        type: "three-point",
        question: "I have enough time to eat my whole meal.",
      },
      {
        id: "ms-meals-line-fast",
        section: "your-meals",
        type: "three-point",
        question: "The lunch line moves fast.",
      },
      {
        id: "ms-meals-cafeteria-clean",
        section: "your-meals",
        type: "three-point",
        question: "The cafeteria and serving lines are clean.",
      },
      {
        id: "ms-ideas-favorite",
        section: "your-ideas",
        type: "open-ended",
        question: "What is your favorite school meal?",
        helper: "Write as much or as little as you want.",
        anonymityReminder: "Don't include your name or anyone else's.",
        maxLength: 10,
      },
      {
        id: "ms-ideas-menu-preferences",
        section: "your-ideas",
        type: "open-ended",
        question: "What is your favorite menu preferences?",
        helper: "Write as much or as little as you want.",
        anonymityReminder: "Don't include your name or anyone else's.",
        maxLength: 10,
      },
      {
        id: "ms-ideas-more-of",
        section: "your-ideas",
        type: "multi-select",
        question:
          "What kind of food would you like to see more of on the school menu?",
        helper: "Select all that apply.",
        options: [
          { value: "italian", label: "Italian (pizza, pasta, red sauce)" },
          { value: "mexican", label: "Mexican (nachos, tacos)" },
          { value: "asian", label: "Asian (stir-fry, orange chicken)" },
          {
            value: "american",
            label: "American (chicken nuggets, hot dogs, hamburgers)",
          },
          {
            value: "southern",
            label: "Southern (chicken and waffles, gumbo, red beans and rice)",
          },
          {
            value: "healthier",
            label: "Healthier options (salad, cut fruit, cut veggies)",
          },
          { value: "other", label: "Other", hasOtherInput: true },
        ],
      },
    ],
  },
  "9-12": {
    gradeBand: "9-12",
    gradeBandDisplay: "Grades 9\u201312",
    gradeOptions: [
      { value: "9", label: "9th grade" },
      { value: "10", label: "10th grade" },
      { value: "11", label: "11th grade" },
      { value: "12", label: "12th grade" },
    ],
    questions: [
      {
        id: "hs-grade",
        section: "about-you",
        type: "grade",
        question: "What grade are you in?",
        privacyNote: "This  is the only thing collected about you.",
      },
      {
        id: "hs-breakfast-freq",
        section: "breakfast",
        type: "frequency",
        question: "I eat school breakfast ____ days per week.",
        helper: "Pick one.",
      },
      {
        id: "hs-breakfast-why-not",
        section: "breakfast",
        type: "multi-select",
        question: "Why don't you eat school breakfast?",
        helper: "Pick all that apply.",
        options: [
          { value: "eat-home", label: "I eat breakfast at home" },
          { value: "not-like", label: "I do not like the food" },
          { value: "not-hungry", label: "I am not hungry" },
          { value: "line-long", label: "The lunch line is too long" },
          { value: "no-time", label: "I do not have enough time to eat" },
          {
            value: "allergies",
            label: "I have food allergies or special food needs",
          },
          { value: "too-expensive", label: "Breakfast is too expensive" },
          { value: "other", label: "Other", hasOtherInput: true },
        ],
        dependsOn: {
          questionId: "hs-breakfast-freq",
          condition: "equals",
          value: 0,
        },
      },
      {
        id: "hs-breakfast-instead",
        section: "breakfast",
        type: "multi-select",
        question: "What do you usually do during breakfast instead?",
        helper: "Pick all that apply.",
        options: [
          { value: "eat-snack", label: "Eat a snack" },
          { value: "share-food", label: "Share food with a friend" },
          { value: "other", label: "Other", hasOtherInput: true },
        ],
        dependsOn: {
          questionId: "hs-breakfast-freq",
          condition: "equals",
          value: 0,
        },
      },
      {
        id: "hs-breakfast-help",
        section: "breakfast",
        type: "multi-select",
        question: "What would help you eat school lunch?",
        helper: "Pick all that apply.",
        dependsOn: {
          questionId: "hs-breakfast-freq",
          condition: "equals",
          value: 0,
        },
        options: [
          { value: "more-foods", label: "More foods I like" },
          { value: "more-choices", label: "More choices each day" },
          {
            value: "shorter-breakfast-lines",
            label: "Shorter breakfast lines",
          },
          { value: "more-time", label: "More time to eat" },
          { value: "healthier", label: "Healthier foods" },
          {
            value: "nothing",
            label: "Nothing would change my mind",
            mutuallyExclusive: true,
          },
        ],
      },
      {
        id: "hs-lunch-freq",
        section: "lunch",
        type: "frequency",
        question: "I eat school lunch _____ days per week.",
        helper: "Pick one.",
      },
      {
        id: "hs-lunch-why-not",
        section: "lunch",
        type: "multi-select",
        question: "Why don't you eat school lunch?",
        helper: "Pick all that apply.",
        options: [
          { value: "bring-home", label: "I bring lunch from home" },
          { value: "not-like", label: "I do not like the food" },
          { value: "not-hungry", label: "I am not hungry" },
          { value: "line-long", label: "The lunch line is too long" },
          { value: "no-time", label: "I do not have enough time to eat" },
          {
            value: "allergies",
            label: "I have food allergies or special food needs",
          },
          { value: "too-expensive", label: "Lunch is too expensive" },
          { value: "other", label: "Other", hasOtherInput: true },
        ],
        dependsOn: {
          questionId: "hs-lunch-freq",
          condition: "equals",
          value: 0,
        },
      },
      {
        id: "hs-lunch-instead",
        section: "lunch",
        type: "multi-select",
        question: "What do you usually do during lunch instead?",
        helper: "Pick all that apply.",
        options: [
          { value: "lunch-from-home", label: "Eat lunch from home" },
          { value: "eat-snack", label: "Eat a snack" },
          { value: "wait-home", label: "Wait until I get home to eat" },
          { value: "share-food", label: "Share food with a friend" },
          { value: "other", label: "Other", hasOtherInput: true },
        ],
        dependsOn: {
          questionId: "hs-lunch-freq",
          condition: "equals",
          value: 0,
        },
      },
      {
        id: "hs-lunch-help",
        section: "lunch",
        type: "multi-select",
        question: "What would help you eat school lunch?",
        helper: "Pick all that apply.",
        dependsOn: {
          questionId: "hs-lunch-freq",
          condition: "equals",
          value: 0,
        },
        options: [
          { value: "more-foods", label: "More foods I like" },
          { value: "more-choices", label: "More choices each day" },
          { value: "shorter-lunch-lines", label: "Shorter lunch lines" },
          { value: "more-time", label: "More time to eat" },
          { value: "healthier", label: "Healthier foods" },
          {
            value: "nothing",
            label: "Nothing would change my mind",
            mutuallyExclusive: true,
          },
        ],
      },
      {
        id: "hs-meals-taste-good",
        section: "your-meals",
        type: "three-point",
        question: "The food tastes good most days.",
      },
      {
        id: "hs-meals-fresh-fruit-veg",
        section: "your-meals",
        type: "three-point",
        question: "The fruits and vegetables look appealing to eat.",
      },
      {
        id: "hs-meals-milk-cold",
        section: "your-meals",
        type: "three-point",
        question: "The milk is served cold and fresh.",
      },
      {
        id: "hs-meals-temperature",
        section: "your-meals",
        type: "three-point",
        question:
          "Meals are served at the right temperature (hot foods hot, cold foods cold).",
      },
      {
        id: "hs-meals-different-weekly",
        section: "your-meals",
        type: "three-point",
        question: "There are different options on the menu each week.",
      },
      {
        id: "hs-meals-enough-choices",
        section: "your-meals",
        type: "three-point",
        question: "There are enough choices on the menu each day.",
      },
      {
        id: "hs-meals-feel-full",
        section: "your-meals",
        type: "three-point",
        question: "After eating a school meal, I feel full.",
      },
      {
        id: "hs-meals-nutritious",
        section: "your-meals",
        type: "three-point",
        question: "The meals are nutritious.",
      },
      {
        id: "hs-meals-dietary",
        section: "your-meals",
        type: "dietary",
        question:
          "If I have a dietary restriction, the school menu caters to my needs (allergy, cultural, religious etc.)",
        helper: "Pick one.",
      },
      {
        id: "hs-meals-staff-friendly",
        section: "your-meals",
        type: "three-point",
        question: "The cafeteria staff are friendly and welcoming.",
      },
      {
        id: "hs-meals-enough-time",
        section: "your-meals",
        type: "three-point",
        question: "I have enough time to eat my whole meal.",
      },
      {
        id: "hs-meals-line-fast",
        section: "your-meals",
        type: "three-point",
        question: "The lunch line moves fast.",
      },
      {
        id: "hs-meals-cafeteria-clean",
        section: "your-meals",
        type: "three-point",
        question: "The cafeteria and serving lines are clean.",
      },
      {
        id: "hs-ideas-reasons-not-eat",
        section: "your-meals",
        type: "multi-select",
        question:
          "If you don't eat school meals often, what are your main reasons?",
        helper: "Pick all that apply.",
        options: [
          { value: "taste", label: "Taste" },
          { value: "cost", label: "Cost" },
          { value: "menu-variety", label: "Menu variety" },
          { value: "time", label: "Time" },
          { value: "friends-dont-eat", label: "Friends don't eat" },
          { value: "other", label: "Other", hasOtherInput: true },
        ],
      },
      {
        id: "hs-ideas-favorite",
        section: "your-ideas",
        type: "open-ended",
        question: "What is your favorite school meal?",
        helper:
          "Write as much or as little as you want. There are no wrong answers.",
        anonymityReminder: "Don't include your name or anyone else's.",
        maxLength: 500,
        dependsOn: {
          questionId: "hs-lunch-freq",
          condition: "eats-school-meals",
          value: 0,
        },
      },
      {
        id: "hs-ideas-least-favorite",
        section: "your-ideas",
        type: "open-ended",
        question: "What is your least favorite school meal?",
        helper:
          "Write as much or as little as you want. There are no wrong answers.",
        anonymityReminder: "Don't include your name or anyone else's.",
        maxLength: 500,
      },
      {
        id: "hs-ideas-add-to-menu",
        section: "your-ideas",
        type: "open-ended",
        question: "What would you add to the school menu?",
        helper:
          "Write as much or as little as you want. There are no wrong answers.",
        anonymityReminder: "Don't include your name or anyone else's.",
        maxLength: 500,
      },
      {
        id: "hs-ideas-feedback-changes",
        section: "your-ideas",
        type: "three-point",
        question:
          "When I share feedback about school meals, I notice changes in what is served.",
      },
    ],
  },
};

export const sectionLabels: Record<string, string> = {
  "about-you": "About you",
  breakfast: "Breakfast",
  lunch: "Lunch",
  "your-meals": "Your meals",
  "your-ideas": "Your ideas",
};

export const sectionIntros: Record<string, SectionIntro> = {
  "about-you": { title: "First, a question about you", subtitle: "Just one!" },
  breakfast: {
    title: "Now let's talk about breakfast",
    subtitle: "Some questions about breakfast at school.",
  },
  lunch: {
    title: "Now let's talk about lunch",
    subtitle: "Some questions about lunch at school.",
  },
  "your-meals": {
    title: "How is the food?",
    subtitle: "Tell us what you think. Tap a face for each one.",
  },
  "your-ideas": {
    title: "How is the food?",
    subtitle: "Almost done. Tell us what you'd like.",
  },
};

export function getInstrument(
  gradeBand: "K-5" | "6-8" | "9-12",
): SurveyInstrument {
  return surveyInstruments[gradeBand];
}
