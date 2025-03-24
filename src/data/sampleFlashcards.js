/**
 * Sample flashcard data for different subjects and grade levels
 * This data can be used to populate the flashcards database with initial content
 */

export const sampleFlashcards = {
  Mathematics: {
    8: [
      {
        topic: "Algebra Basics",
        cards: [
          { front: "What is a variable?", back: "A symbol (usually a letter) that represents an unknown value or can take on different values." },
          { front: "What is the distributive property?", back: "a(b + c) = ab + ac" },
          { front: "How do you solve x + 5 = 12?", back: "Subtract 5 from both sides: x = 7" },
          { front: "What is the order of operations?", back: "PEMDAS: Parentheses, Exponents, Multiplication/Division, Addition/Subtraction" },
          { front: "What is a coefficient?", back: "The number that multiplies a variable (e.g., in 5x, 5 is the coefficient)" }
        ]
      },
      {
        topic: "Geometry Fundamentals",
        cards: [
          { front: "What is a right angle?", back: "An angle that is exactly 90 degrees" },
          { front: "What is the formula for the area of a rectangle?", back: "Area = length × width" },
          { front: "What is the formula for the perimeter of a rectangle?", back: "Perimeter = 2(length + width)" },
          { front: "What is the sum of angles in a triangle?", back: "180 degrees" },
          { front: "What is a line of symmetry?", back: "A line that divides a shape into two identical parts" }
        ]
      }
    ],
    9: [
      {
        topic: "Linear Equations",
        cards: [
          { front: "What is the slope-intercept form of a linear equation?", back: "y = mx + b, where m is the slope and b is the y-intercept" },
          { front: "How do you find the slope between two points (x₁,y₁) and (x₂,y₂)?", back: "Slope = (y₂ - y₁) / (x₂ - x₁)" },
          { front: "What are parallel lines?", back: "Lines with the same slope that never intersect" },
          { front: "What are perpendicular lines?", back: "Lines that intersect at a 90° angle; their slopes are negative reciprocals of each other" },
          { front: "What is the point-slope form of a linear equation?", back: "y - y₁ = m(x - x₁), where m is the slope and (x₁,y₁) is a point on the line" }
        ]
      }
    ],
    10: [
      {
        topic: "Quadratic Equations",
        cards: [
          { front: "What is the standard form of a quadratic equation?", back: "ax² + bx + c = 0, where a ≠ 0" },
          { front: "What is the quadratic formula?", back: "x = (-b ± √(b² - 4ac)) / 2a" },
          { front: "What is the discriminant in a quadratic equation?", back: "b² - 4ac, which determines the number and type of solutions" },
          { front: "What is the vertex form of a quadratic equation?", back: "y = a(x - h)² + k, where (h,k) is the vertex" },
          { front: "How do you find the axis of symmetry of a parabola?", back: "x = -b / 2a" }
        ]
      }
    ],
    11: [
      {
        topic: "Trigonometry",
        cards: [
          { front: "What is the sine of an angle in a right triangle?", back: "sin(θ) = opposite / hypotenuse" },
          { front: "What is the cosine of an angle in a right triangle?", back: "cos(θ) = adjacent / hypotenuse" },
          { front: "What is the tangent of an angle in a right triangle?", back: "tan(θ) = opposite / adjacent" },
          { front: "What is the Pythagorean identity?", back: "sin²(θ) + cos²(θ) = 1" },
          { front: "What is the law of sines?", back: "a/sin(A) = b/sin(B) = c/sin(C)" }
        ]
      }
    ],
    12: [
      {
        topic: "Calculus Basics",
        cards: [
          { front: "What is a limit?", back: "The value that a function approaches as the input approaches a certain value" },
          { front: "What is the derivative of a function?", back: "The rate of change of the function with respect to a variable" },
          { front: "What is the power rule for derivatives?", back: "If f(x) = xⁿ, then f'(x) = n·xⁿ⁻¹" },
          { front: "What is the chain rule?", back: "If f(x) = g(h(x)), then f'(x) = g'(h(x))·h'(x)" },
          { front: "What is an integral?", back: "A function that represents the area under a curve" }
        ]
      }
    ]
  },
  
  English: {
    8: [
      {
        topic: "Grammar Basics",
        cards: [
          { front: "What is a noun?", back: "A word that names a person, place, thing, or idea" },
          { front: "What is a verb?", back: "A word that expresses an action, occurrence, or state of being" },
          { front: "What is an adjective?", back: "A word that describes or modifies a noun" },
          { front: "What is an adverb?", back: "A word that modifies a verb, adjective, or other adverb" },
          { front: "What is a preposition?", back: "A word that shows the relationship between a noun/pronoun and other words in a sentence" }
        ]
      }
    ],
    9: [
      {
        topic: "Literary Devices",
        cards: [
          { front: "What is a metaphor?", back: "A figure of speech that makes a comparison between two unrelated things without using 'like' or 'as'" },
          { front: "What is a simile?", back: "A figure of speech that makes a comparison between two unlike things using 'like' or 'as'" },
          { front: "What is personification?", back: "Giving human qualities to non-human things" },
          { front: "What is alliteration?", back: "The repetition of the same sound at the beginning of a series of words" },
          { front: "What is hyperbole?", back: "Extreme exaggeration used for emphasis or effect" }
        ]
      }
    ],
    10: [
      {
        topic: "Essay Writing",
        cards: [
          { front: "What is a thesis statement?", back: "A sentence that states the main argument or point of an essay" },
          { front: "What is a topic sentence?", back: "The first sentence of a paragraph that introduces the main idea of that paragraph" },
          { front: "What is a conclusion paragraph?", back: "The final paragraph that summarizes the main points and restates the thesis" },
          { front: "What is a supporting detail?", back: "Evidence, examples, or explanations that support the main idea" },
          { front: "What is a transition word?", back: "Words or phrases that connect ideas and show relationships between sentences or paragraphs" }
        ]
      }
    ],
    11: [
      {
        topic: "Advanced Grammar",
        cards: [
          { front: "What is a subordinate clause?", back: "A clause that cannot stand alone as a complete sentence and depends on a main clause" },
          { front: "What is a dangling modifier?", back: "A word or phrase that modifies an unintended subject" },
          { front: "What is parallel structure?", back: "Using the same pattern of words to show that two or more ideas have equal importance" },
          { front: "What is active voice?", back: "When the subject of a sentence performs the action" },
          { front: "What is passive voice?", back: "When the subject of a sentence receives the action" }
        ]
      }
    ],
    12: [
      {
        topic: "Critical Analysis",
        cards: [
          { front: "What is a theme?", back: "The central message or insight about life revealed in a literary work" },
          { front: "What is symbolism?", back: "The use of symbols to represent ideas or qualities" },
          { front: "What is irony?", back: "A contrast between expectation and reality" },
          { front: "What is tone?", back: "The author's attitude toward the subject or audience" },
          { front: "What is a motif?", back: "A recurring element that has symbolic significance in a story" }
        ]
      }
    ]
  },
  
  Science: {
    8: [
      {
        topic: "Scientific Method",
        cards: [
          { front: "What is a hypothesis?", back: "A testable explanation for an observation or phenomenon" },
          { front: "What is a control group?", back: "The group in an experiment that does not receive the treatment being tested" },
          { front: "What is a variable?", back: "A factor that can change in an experiment" },
          { front: "What is an observation?", back: "Information gathered using the senses" },
          { front: "What is a conclusion?", back: "A summary of the results and whether they support the hypothesis" }
        ]
      }
    ],
    9: [
      {
        topic: "Earth Science",
        cards: [
          { front: "What are tectonic plates?", back: "Large pieces of the Earth's crust that move and interact with each other" },
          { front: "What is the water cycle?", back: "The continuous movement of water on, above, and below the Earth's surface" },
          { front: "What is weathering?", back: "The breaking down of rocks, soils, and minerals through contact with the Earth's atmosphere" },
          { front: "What is a fossil?", back: "Preserved remains or traces of organisms from the past" },
          { front: "What is the greenhouse effect?", back: "The trapping of the sun's heat in the Earth's atmosphere by certain gases" }
        ]
      }
    ]
  },
  
  Chemistry: {
    10: [
      {
        topic: "Periodic Table",
        cards: [
          { front: "What is an element?", back: "A pure substance that cannot be broken down into simpler substances by chemical means" },
          { front: "What is an atomic number?", back: "The number of protons in an atom's nucleus" },
          { front: "What is a period in the periodic table?", back: "A horizontal row of elements" },
          { front: "What is a group in the periodic table?", back: "A vertical column of elements with similar properties" },
          { front: "What are noble gases?", back: "Elements in Group 18 that are generally unreactive due to their full outer electron shells" }
        ]
      }
    ],
    11: [
      {
        topic: "Chemical Reactions",
        cards: [
          { front: "What is a chemical reaction?", back: "A process where substances change into different substances with different properties" },
          { front: "What is a reactant?", back: "A substance that enters into a chemical reaction" },
          { front: "What is a product?", back: "A substance that is formed in a chemical reaction" },
          { front: "What is an exothermic reaction?", back: "A reaction that releases energy in the form of heat" },
          { front: "What is an endothermic reaction?", back: "A reaction that absorbs energy in the form of heat" }
        ]
      }
    ],
    12: [
      {
        topic: "Acids and Bases",
        cards: [
          { front: "What is pH?", back: "A measure of how acidic or basic a solution is, ranging from 0 to 14" },
          { front: "What is an acid?", back: "A substance that donates hydrogen ions (H+) in solution" },
          { front: "What is a base?", back: "A substance that accepts hydrogen ions (H+) or donates hydroxide ions (OH-) in solution" },
          { front: "What is neutralization?", back: "A reaction between an acid and a base that produces water and a salt" },
          { front: "What is a buffer?", back: "A solution that resists changes in pH when small amounts of acid or base are added" }
        ]
      }
    ]
  },
  
  Biology: {
    10: [
      {
        topic: "Cell Biology",
        cards: [
          { front: "What is a cell?", back: "The basic structural and functional unit of all living organisms" },
          { front: "What is the cell membrane?", back: "A selectively permeable barrier that surrounds the cell and controls what enters and exits" },
          { front: "What is the nucleus?", back: "The control center of the cell that contains genetic material" },
          { front: "What is mitochondria?", back: "The powerhouse of the cell where cellular respiration occurs" },
          { front: "What is the difference between prokaryotic and eukaryotic cells?", back: "Prokaryotic cells lack a nucleus and membrane-bound organelles, while eukaryotic cells have them" }
        ]
      }
    ],
    11: [
      {
        topic: "Genetics",
        cards: [
          { front: "What is DNA?", back: "Deoxyribonucleic acid; the genetic material that carries instructions for development, functioning, and reproduction" },
          { front: "What is a gene?", back: "A segment of DNA that contains instructions for making a specific protein" },
          { front: "What is a chromosome?", back: "A structure of DNA and protein found in the nucleus of cells" },
          { front: "What is a mutation?", back: "A change in the DNA sequence" },
          { front: "What is Punnett square?", back: "A diagram used to predict the outcome of a particular cross or breeding experiment" }
        ]
      }
    ],
    12: [
      {
        topic: "Human Body Systems",
        cards: [
          { front: "What is the function of the circulatory system?", back: "To transport oxygen, nutrients, hormones, and waste products throughout the body" },
          { front: "What is the function of the respiratory system?", back: "To bring oxygen into the body and remove carbon dioxide" },
          { front: "What is the function of the digestive system?", back: "To break down food into nutrients that can be absorbed and used by the body" },
          { front: "What is the function of the nervous system?", back: "To transmit signals between different parts of the body and coordinate voluntary and involuntary actions" },
          { front: "What is the function of the endocrine system?", back: "To produce hormones that regulate metabolism, growth, development, and reproduction" }
        ]
      }
    ]
  },
  
  Physics: {
    11: [
      {
        topic: "Mechanics",
        cards: [
          { front: "What is Newton's First Law of Motion?", back: "An object at rest stays at rest and an object in motion stays in motion with the same speed and direction unless acted upon by an unbalanced force" },
          { front: "What is Newton's Second Law of Motion?", back: "Force equals mass times acceleration (F = ma)" },
          { front: "What is Newton's Third Law of Motion?", back: "For every action, there is an equal and opposite reaction" },
          { front: "What is momentum?", back: "The product of an object's mass and velocity (p = mv)" },
          { front: "What is the law of conservation of energy?", back: "Energy cannot be created or destroyed, only transformed from one form to another" }
        ]
      }
    ],
    12: [
      {
        topic: "Electricity",
        cards: [
          { front: "What is Ohm's Law?", back: "Current equals voltage divided by resistance (I = V/R)" },
          { front: "What is an electric current?", back: "The flow of electric charge through a conductor" },
          { front: "What is resistance?", back: "The opposition to the flow of electric current in a material" },
          { front: "What is a series circuit?", back: "A circuit where components are connected along a single path" },
          { front: "What is a parallel circuit?", back: "A circuit where components are connected along multiple paths" }
        ]
      },
      {
        topic: "Waves",
        cards: [
          { front: "What is a wave?", back: "A disturbance that transfers energy from one place to another without transferring matter" },
          { front: "What is wavelength?", back: "The distance between two consecutive points in a wave that are in phase" },
          { front: "What is frequency?", back: "The number of complete waves that pass a point in a given time" },
          { front: "What is the relationship between wavelength and frequency?", back: "Wavelength × frequency = wave speed" },
          { front: "What is the Doppler effect?", back: "The change in frequency of a wave in relation to an observer who is moving relative to the wave source" }
        ]
      }
    ]
  }
};

export default sampleFlashcards;
