
// src/mocks/call-results.ts

import type { InterestLevel, CallStatus } from "@/types";

export interface CallResultDetail {
  id: string;
  campaign_id: string;
  campaign_name: string;
  lead_id: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  nationality: string;

  // Call Info
  call_status: CallStatus;
  call_duration: number;
  call_initiated_at: string;
  call_ended_at: string;
  recording_url: string | null;

  // AI Analysis
  interest_level: InterestLevel;
  qualification_score: number;
  summary: string;

  // Qualification Data
  qualification_data: {
    is_interested: boolean;
    requested_callback: boolean;
    budget_confirmed: boolean;
    budget_mentioned: string | null;
    timeline: string | null;
    purpose: string | null;
    objections: string[];
    key_questions: string[];
  };

  // Transcript
  transcript: string;
  transcript_json: {
    role: "assistant" | "user";
    message: string;
    timestamp: number;
  }[];
}

export const mockCallResults: CallResultDetail[] = [
  {
    id: "cr-001",
    campaign_id: "camp-001",
    campaign_name: "Marina Heights Tower Launch",
    lead_id: "l-001",
    first_name: "Ahmed",
    last_name: "Al Rashid",
    phone: "+971501234567",
    email: "ahmed.rashid@email.com",
    nationality: "UAE",
    call_status: "completed",
    call_duration: 245,
    call_initiated_at: "2025-06-13T09:05:00Z",
    call_ended_at: "2025-06-13T09:09:05Z",
    recording_url: "https://recordings.vapi.ai/rec-001.mp3",
    interest_level: "hot",
    qualification_score: 92,
    summary:
      "Ahmed is very interested in 2BR units at Marina Heights Tower. He confirmed his budget at AED 2.5M and wants to visit the sales center this week. He specifically asked about sea-facing units on higher floors. He requested a callback from the sales team to schedule a viewing on Thursday.",
    qualification_data: {
      is_interested: true,
      requested_callback: true,
      budget_confirmed: true,
      budget_mentioned: "AED 2,500,000",
      timeline: "This week",
      purpose: "personal",
      objections: [],
      key_questions: [
        "Which floors have sea views?",
        "Is parking included?",
        "What is the service charge?",
      ],
    },
    transcript:
      "Agent: Hello, may I speak with Ahmed? I'm calling about an exciting property opportunity at Marina Heights Tower in Dubai Marina.\n\nAhmed: Yes, this is Ahmed speaking. Dubai Marina, you said?\n\nAgent: Yes! Marina Heights Tower is a premium 45-storey residential development by Emaar Properties. It offers stunning views of the Marina and the Arabian Gulf. We have units ranging from studios to 3-bedroom apartments, starting from AED 1.2 million.\n\nAhmed: That sounds interesting. I've been looking at properties in Marina actually. What do you have in 2-bedroom units?\n\nAgent: Great choice! Our 2-bedroom units range from AED 2.1 million to AED 3.2 million depending on the floor and view. They come with floor-to-ceiling windows, Italian marble finishes, and smart home technology.\n\nAhmed: I'm interested in something around 2.5 million. Do you have sea-facing units at that price?\n\nAgent: Absolutely, we have several 2-bedroom sea-facing units in that range on floors 25 to 35. Would you be interested in scheduling a viewing?\n\nAhmed: Yes, definitely. Can someone call me back to arrange a visit? I'm free on Thursday.\n\nAgent: Of course! I'll have our sales team reach out to you to schedule a Thursday viewing. Before I go, do you have any other questions?\n\nAhmed: Is parking included? And what's the service charge like?\n\nAgent: Yes, each unit comes with one dedicated parking space, with additional spaces available for purchase. The service charge is approximately AED 16 per square foot annually. Very competitive for the area.\n\nAhmed: Perfect, that all sounds good. I look forward to the callback.\n\nAgent: Wonderful, Ahmed! Thank you for your time. Our team will be in touch shortly. Have a great day!",
    transcript_json: [
      {
        role: "assistant",
        message:
          "Hello, may I speak with Ahmed? I'm calling about an exciting property opportunity at Marina Heights Tower in Dubai Marina.",
        timestamp: 0,
      },
      {
        role: "user",
        message:
          "Yes, this is Ahmed speaking. Dubai Marina, you said?",
        timestamp: 5,
      },
      {
        role: "assistant",
        message:
          "Yes! Marina Heights Tower is a premium 45-storey residential development by Emaar Properties. It offers stunning views of the Marina and the Arabian Gulf. We have units ranging from studios to 3-bedroom apartments, starting from AED 1.2 million.",
        timestamp: 8,
      },
      {
        role: "user",
        message:
          "That sounds interesting. I've been looking at properties in Marina actually. What do you have in 2-bedroom units?",
        timestamp: 25,
      },
      {
        role: "assistant",
        message:
          "Great choice! Our 2-bedroom units range from AED 2.1 million to AED 3.2 million depending on the floor and view. They come with floor-to-ceiling windows, Italian marble finishes, and smart home technology.",
        timestamp: 32,
      },
      {
        role: "user",
        message:
          "I'm interested in something around 2.5 million. Do you have sea-facing units at that price?",
        timestamp: 48,
      },
      {
        role: "assistant",
        message:
          "Absolutely, we have several 2-bedroom sea-facing units in that range on floors 25 to 35. Would you be interested in scheduling a viewing?",
        timestamp: 55,
      },
      {
        role: "user",
        message:
          "Yes, definitely. Can someone call me back to arrange a visit? I'm free on Thursday.",
        timestamp: 65,
      },
      {
        role: "assistant",
        message:
          "Of course! I'll have our sales team reach out to you to schedule a Thursday viewing. Before I go, do you have any other questions?",
        timestamp: 72,
      },
      {
        role: "user",
        message:
          "Is parking included? And what's the service charge like?",
        timestamp: 82,
      },
      {
        role: "assistant",
        message:
          "Yes, each unit comes with one dedicated parking space, with additional spaces available for purchase. The service charge is approximately AED 16 per square foot annually. Very competitive for the area.",
        timestamp: 87,
      },
      {
        role: "user",
        message:
          "Perfect, that all sounds good. I look forward to the callback.",
        timestamp: 100,
      },
      {
        role: "assistant",
        message:
          "Wonderful, Ahmed! Thank you for your time. Our team will be in touch shortly. Have a great day!",
        timestamp: 105,
      },
    ],
  },
  {
    id: "cr-002",
    campaign_id: "camp-001",
    campaign_name: "Marina Heights Tower Launch",
    lead_id: "l-002",
    first_name: "Sarah",
    last_name: "Johnson",
    phone: "+971559876543",
    email: "sarah.j@gmail.com",
    nationality: "UK",
    call_status: "completed",
    call_duration: 312,
    call_initiated_at: "2025-06-13T09:10:00Z",
    call_ended_at: "2025-06-13T09:15:12Z",
    recording_url: "https://recordings.vapi.ai/rec-002.mp3",
    interest_level: "hot",
    qualification_score: 88,
    summary:
      "Sarah is relocating from London to Dubai and is actively looking for a 3BR apartment. She confirmed her budget of AED 3.5M and was particularly impressed by the amenities. She wants a floor plan emailed and requested a video call with the sales team.",
    qualification_data: {
      is_interested: true,
      requested_callback: true,
      budget_confirmed: true,
      budget_mentioned: "AED 3,500,000",
      timeline: "2–3 months",
      purpose: "personal",
      objections: ["Wants to compare with other developments"],
      key_questions: [
        "Can I see floor plans?",
        "Is there a school nearby?",
        "What are the visa options?",
      ],
    },
    transcript: "",
    transcript_json: [
      {
        role: "assistant",
        message: "Hello, may I speak with Sarah? I'm calling about Marina Heights Tower in Dubai Marina.",
        timestamp: 0,
      },
      {
        role: "user",
        message: "Hi, yes this is Sarah. I've actually been looking at Dubai properties online.",
        timestamp: 4,
      },
      {
        role: "assistant",
        message: "That's great to hear! Marina Heights Tower by Emaar is a new 45-storey development with stunning views. What type of unit are you looking for?",
        timestamp: 8,
      },
      {
        role: "user",
        message: "We're a family of four relocating from London. I need at least 3 bedrooms. Our budget is around 3.5 million dirhams.",
        timestamp: 18,
      },
      {
        role: "assistant",
        message: "Wonderful! Our 3-bedroom units are priced between AED 2.8M and AED 4.5M. They feature spacious layouts, a maid's room, and premium finishes. The building also has a kids' play area and is close to international schools.",
        timestamp: 28,
      },
      {
        role: "user",
        message: "That sounds perfect. Can you send me the floor plans? Also, are there good schools nearby?",
        timestamp: 45,
      },
      {
        role: "assistant",
        message: "Absolutely! I'll have our team email you the floor plans. There are several international schools within 10 minutes, including GEMS and Dubai British School. Would you like to arrange a virtual viewing?",
        timestamp: 52,
      },
      {
        role: "user",
        message: "Yes, a video call would be great. I want to compare with a few other developments first though.",
        timestamp: 68,
      },
      {
        role: "assistant",
        message: "Of course, take your time. I'll have our sales consultant arrange a video call at your convenience and send all the details via email. When are you planning to move?",
        timestamp: 75,
      },
      {
        role: "user",
        message: "In about 2 to 3 months. We want to have everything sorted before the school year.",
        timestamp: 88,
      },
      {
        role: "assistant",
        message: "That timeline works perfectly with our availability. Thank you Sarah, our team will be in touch shortly!",
        timestamp: 95,
      },
    ],
  },
  {
    id: "cr-003",
    campaign_id: "camp-001",
    campaign_name: "Marina Heights Tower Launch",
    lead_id: "l-003",
    first_name: "Mohammed",
    last_name: "Khan",
    phone: "+971521112233",
    email: "m.khan@outlook.com",
    nationality: "Pakistan",
    call_status: "completed",
    call_duration: 198,
    call_initiated_at: "2025-06-13T09:16:00Z",
    call_ended_at: "2025-06-13T09:19:18Z",
    recording_url: null,
    interest_level: "warm",
    qualification_score: 65,
    summary:
      "Mohammed is interested in the property for investment purposes. He's comparing ROI with other projects and wants to see projected rental yields. Budget of AED 1.5M limits him to studios and 1BR units.",
    qualification_data: {
      is_interested: true,
      requested_callback: false,
      budget_confirmed: true,
      budget_mentioned: "AED 1,500,000",
      timeline: "3–6 months",
      purpose: "investment",
      objections: ["Wants higher ROI", "Comparing with JVC properties"],
      key_questions: [
        "What is the expected rental yield?",
        "What are the unit sizes for 1BR?",
      ],
    },
    transcript: "",
    transcript_json: [
      {
        role: "assistant",
        message: "Hello Mohammed, I'm calling about Marina Heights Tower in Dubai Marina. Do you have a moment?",
        timestamp: 0,
      },
      {
        role: "user",
        message: "Yes, go ahead. I'm looking for investment properties.",
        timestamp: 5,
      },
      {
        role: "assistant",
        message: "Marina Heights is an excellent investment choice. Dubai Marina consistently delivers 6-8% rental yields. What's your investment budget?",
        timestamp: 10,
      },
      {
        role: "user",
        message: "Around 1.5 million. But I'm also looking at JVC which seems to offer better returns for the price.",
        timestamp: 22,
      },
      {
        role: "assistant",
        message: "I understand. While JVC offers lower entry prices, Marina commands premium rents and has stronger capital appreciation. Our studios start at AED 1.2M and 1-bedrooms from AED 1.6M.",
        timestamp: 30,
      },
      {
        role: "user",
        message: "Can you send me the projected rental yields and unit sizes? I need to run the numbers before deciding.",
        timestamp: 48,
      },
      {
        role: "assistant",
        message: "Of course, I'll have that information emailed to you right away. Thank you for your time, Mohammed!",
        timestamp: 55,
      },
    ],
  },
  {
    id: "cr-004",
    campaign_id: "camp-001",
    campaign_name: "Marina Heights Tower Launch",
    lead_id: "l-004",
    first_name: "Elena",
    last_name: "Petrova",
    phone: "+971507778899",
    email: "elena.p@mail.ru",
    nationality: "Russia",
    call_status: "completed",
    call_duration: 156,
    call_initiated_at: "2025-06-13T09:20:00Z",
    call_ended_at: "2025-06-13T09:22:36Z",
    recording_url: "https://recordings.vapi.ai/rec-004.mp3",
    interest_level: "warm",
    qualification_score: 58,
    summary:
      "Elena likes the property and wants a sea view unit. She needs to discuss the purchase with her husband first and asked to be contacted again in 2 weeks. Budget around AED 4M.",
    qualification_data: {
      is_interested: true,
      requested_callback: true,
      budget_confirmed: false,
      budget_mentioned: "AED 4,000,000",
      timeline: "2 weeks follow-up",
      purpose: "personal",
      objections: ["Needs spouse approval"],
      key_questions: ["Do you have units above floor 30?"],
    },
    transcript: "",
    transcript_json: [
      {
        role: "assistant",
        message: "Hello Elena, I'm reaching out about Marina Heights Tower. Is now a good time?",
        timestamp: 0,
      },
      {
        role: "user",
        message: "Sure, tell me about it. I love Dubai Marina.",
        timestamp: 4,
      },
      {
        role: "assistant",
        message: "Marina Heights is a stunning 45-storey tower with panoramic sea views, infinity pool, and luxury finishes. What type of unit are you interested in?",
        timestamp: 8,
      },
      {
        role: "user",
        message: "Something with a sea view, higher floor. Maybe 2 or 3 bedrooms. But I need to talk to my husband first.",
        timestamp: 20,
      },
      {
        role: "assistant",
        message: "Of course! We have beautiful sea-facing units on floors 30 and above. Can I reach out to you again in a couple of weeks?",
        timestamp: 30,
      },
      {
        role: "user",
        message: "Yes, please call me in 2 weeks. Thank you.",
        timestamp: 40,
      },
    ],
  },
  {
    id: "cr-005",
    campaign_id: "camp-001",
    campaign_name: "Marina Heights Tower Launch",
    lead_id: "l-005",
    first_name: "James",
    last_name: "Williams",
    phone: "+971543334455",
    email: "james.w@proton.me",
    nationality: "USA",
    call_status: "completed",
    call_duration: 89,
    call_initiated_at: "2025-06-13T09:23:00Z",
    call_ended_at: "2025-06-13T09:24:29Z",
    recording_url: null,
    interest_level: "cold",
    qualification_score: 25,
    summary:
      "James is not actively looking right now. He recently purchased a property and might consider another investment in 6 months. Politely declined further follow-up at this time.",
    qualification_data: {
      is_interested: false,
      requested_callback: false,
      budget_confirmed: false,
      budget_mentioned: null,
      timeline: "6+ months",
      purpose: null,
      objections: ["Just bought a property", "Not looking right now"],
      key_questions: [],
    },
    transcript: "",
    transcript_json: [
      {
        role: "assistant",
        message: "Hello James, I'm calling about an investment opportunity at Marina Heights Tower. Do you have a moment?",
        timestamp: 0,
      },
      {
        role: "user",
        message: "Hi, not really the best time. I just purchased a property last month actually.",
        timestamp: 5,
      },
      {
        role: "assistant",
        message: "Congratulations on your recent purchase! Would you be open to hearing about this for a future investment?",
        timestamp: 12,
      },
      {
        role: "user",
        message: "Maybe in 6 months or so. Not right now though.",
        timestamp: 20,
      },
      {
        role: "assistant",
        message: "Understood completely. Thank you for your time, James. Have a great day!",
        timestamp: 25,
      },
    ],
  },
  {
    id: "cr-006",
    campaign_id: "camp-001",
    campaign_name: "Marina Heights Tower Launch",
    lead_id: "l-006",
    first_name: "Fatima",
    last_name: "Al Maktoum",
    phone: "+971502223344",
    email: "fatima.m@email.com",
    nationality: "UAE",
    call_status: "completed",
    call_duration: 278,
    call_initiated_at: "2025-06-13T09:25:00Z",
    call_ended_at: "2025-06-13T09:29:38Z",
    recording_url: "https://recordings.vapi.ai/rec-006.mp3",
    interest_level: "hot",
    qualification_score: 95,
    summary:
      "Fatima wants to purchase 3 units for investment. She's an experienced investor with a portfolio in Dubai. Ready to visit the sales center this week and wants priority allocation. Budget is AED 5M+ per unit.",
    qualification_data: {
      is_interested: true,
      requested_callback: true,
      budget_confirmed: true,
      budget_mentioned: "AED 15,000,000+ (3 units)",
      timeline: "Immediate",
      purpose: "investment",
      objections: [],
      key_questions: [
        "Is there a bulk purchase discount?",
        "What floors are still available?",
        "Can I get priority allocation?",
      ],
    },
    transcript: "",
    transcript_json: [
      {
        role: "assistant",
        message: "Hello Fatima, I'm calling about Marina Heights Tower by Emaar in Dubai Marina. Do you have a few minutes?",
        timestamp: 0,
      },
      {
        role: "user",
        message: "Yes, I know Emaar well. I have several properties in my portfolio. Tell me about this project.",
        timestamp: 5,
      },
      {
        role: "assistant",
        message: "Excellent! Marina Heights is a 45-storey premium tower with prices starting from AED 1.2M. It's in a prime Marina location with projected yields of 7-8%.",
        timestamp: 12,
      },
      {
        role: "user",
        message: "I'm interested in buying 3 units for investment. What's available on the higher floors? And is there a bulk discount?",
        timestamp: 25,
      },
      {
        role: "assistant",
        message: "We do have special allocation for bulk investors. Floors 35-45 still have excellent availability. I'd recommend meeting our investment team who can prepare a customized package for you.",
        timestamp: 35,
      },
      {
        role: "user",
        message: "Perfect. I want priority allocation before these go to the general public. Can I come to the sales center this week?",
        timestamp: 50,
      },
      {
        role: "assistant",
        message: "Absolutely! I'll arrange a VIP appointment with our senior sales director. Would Wednesday or Thursday work for you?",
        timestamp: 58,
      },
      {
        role: "user",
        message: "Wednesday morning works. Set it up.",
        timestamp: 68,
      },
      {
        role: "assistant",
        message: "Done! Wednesday morning it is. Thank you, Fatima. Our team will confirm the details shortly!",
        timestamp: 72,
      },
    ],
  },
  {
    id: "cr-007",
    campaign_id: "camp-001",
    campaign_name: "Marina Heights Tower Launch",
    lead_id: "l-011",
    first_name: "Khalid",
    last_name: "Al Saud",
    phone: "+971508887766",
    email: "khalid.s@ksa.com",
    nationality: "Saudi Arabia",
    call_status: "completed",
    call_duration: 334,
    call_initiated_at: "2025-06-13T09:34:00Z",
    call_ended_at: "2025-06-13T09:39:34Z",
    recording_url: null,
    interest_level: "warm",
    qualification_score: 72,
    summary:
      "Khalid is interested but wants a detailed brochure and payment plan emailed. He needs to understand the post-handover payment structure. Budget fits but wants to compare with a project in Palm Jumeirah.",
    qualification_data: {
      is_interested: true,
      requested_callback: false,
      budget_confirmed: true,
      budget_mentioned: "AED 6,000,000",
      timeline: "1–2 months",
      purpose: "both",
      objections: ["Comparing with Palm Jumeirah project"],
      key_questions: [
        "What is the post-handover payment plan?",
        "Can I see the full brochure?",
      ],
    },
    transcript: "",
    transcript_json: [
      {
        role: "assistant",
        message: "Hello Khalid, I'm calling regarding Marina Heights Tower. Do you have a moment?",
        timestamp: 0,
      },
      {
        role: "user",
        message: "Yes, briefly. What's the payment plan like?",
        timestamp: 4,
      },
      {
        role: "assistant",
        message: "We offer a 10% booking, 50% during construction, and 40% on handover. Post-handover plans are available for select units.",
        timestamp: 8,
      },
      {
        role: "user",
        message: "Interesting. I'm also looking at something on Palm Jumeirah. Can you email me the full details so I can compare?",
        timestamp: 22,
      },
      {
        role: "assistant",
        message: "Absolutely! I'll send you the brochure, payment plan, and availability list right away. Any specific unit type you're interested in?",
        timestamp: 30,
      },
      {
        role: "user",
        message: "2 or 3 bedrooms. Premium units.",
        timestamp: 40,
      },
      {
        role: "assistant",
        message: "Noted! I'll include the premium floor plans. Thank you Khalid, expect the email within the hour.",
        timestamp: 45,
      },
    ],
  },
  {
    id: "cr-008",
    campaign_id: "camp-001",
    campaign_name: "Marina Heights Tower Launch",
    lead_id: "l-013",
    first_name: "Yusuf",
    last_name: "Demir",
    phone: "+971523332211",
    email: "yusuf.d@turk.tr",
    nationality: "Turkey",
    call_status: "completed",
    call_duration: 167,
    call_initiated_at: "2025-06-13T09:42:00Z",
    call_ended_at: "2025-06-13T09:44:47Z",
    recording_url: null,
    interest_level: "cold",
    qualification_score: 30,
    summary:
      "Yusuf's budget of under AED 1M doesn't match the project's pricing. He was polite but clearly the property is out of his range. Suggested looking at more affordable areas.",
    qualification_data: {
      is_interested: false,
      requested_callback: false,
      budget_confirmed: true,
      budget_mentioned: "Under AED 1,000,000",
      timeline: null,
      purpose: "personal",
      objections: ["Budget too low for this project"],
      key_questions: [],
    },
    transcript: "",
    transcript_json: [
      {
        role: "assistant",
        message: "Hello Yusuf, I'm calling about Marina Heights Tower. Are you currently looking for property in Dubai?",
        timestamp: 0,
      },
      {
        role: "user",
        message: "Yes, but my budget is limited. Under 1 million dirhams.",
        timestamp: 5,
      },
      {
        role: "assistant",
        message: "I appreciate your honesty. Marina Heights starts at AED 1.2M for studios. It might be slightly above your current budget. Would you like me to suggest alternative areas that might fit better?",
        timestamp: 12,
      },
      {
        role: "user",
        message: "No, that's fine. I'll look on my own. Thank you though.",
        timestamp: 25,
      },
      {
        role: "assistant",
        message: "Of course! Best of luck with your property search, Yusuf. Have a great day!",
        timestamp: 30,
      },
    ],
  },
  {
    id: "cr-009",
    campaign_id: "camp-001",
    campaign_name: "Marina Heights Tower Launch",
    lead_id: "l-009",
    first_name: "Omar",
    last_name: "Hassan",
    phone: "+971524445566",
    email: "omar.h@business.eg",
    nationality: "Egypt",
    call_status: "completed",
    call_duration: 45,
    call_initiated_at: "2025-06-13T09:30:00Z",
    call_ended_at: "2025-06-13T09:30:45Z",
    recording_url: null,
    interest_level: "not_interested",
    qualification_score: 5,
    summary:
      "Omar already purchased a property recently and is not interested in any new offerings. Call was very brief.",
    qualification_data: {
      is_interested: false,
      requested_callback: false,
      budget_confirmed: false,
      budget_mentioned: null,
      timeline: null,
      purpose: null,
      objections: ["Already bought a property"],
      key_questions: [],
    },
    transcript: "",
    transcript_json: [
      {
        role: "assistant",
        message: "Hello Omar, I'm calling about a property in Dubai Marina—",
        timestamp: 0,
      },
      {
        role: "user",
        message: "Sorry, I just bought a place. Not interested. Thank you.",
        timestamp: 4,
      },
      {
        role: "assistant",
        message: "No problem at all, Omar. Congratulations on your purchase. Have a wonderful day!",
        timestamp: 8,
      },
    ],
  },
  {
    id: "cr-010",
    campaign_id: "camp-001",
    campaign_name: "Marina Heights Tower Launch",
    lead_id: "l-017",
    first_name: "Wei",
    last_name: "Zhang",
    phone: "+971528889900",
    email: "wei.z@alibaba.cn",
    nationality: "China",
    call_status: "completed",
    call_duration: 210,
    call_initiated_at: "2025-06-13T09:46:00Z",
    call_ended_at: "2025-06-13T09:49:30Z",
    recording_url: "https://recordings.vapi.ai/rec-010.mp3",
    interest_level: "warm",
    qualification_score: 68,
    summary:
      "Wei is interested in bulk investment and wants to see projected ROI data. He manages an investment fund and could potentially purchase 5-10 units. Needs a formal investment proposal.",
    qualification_data: {
      is_interested: true,
      requested_callback: true,
      budget_confirmed: false,
      budget_mentioned: "Fund allocation — undisclosed",
      timeline: "Q3 2025",
      purpose: "investment",
      objections: ["Needs formal ROI projections"],
      key_questions: [
        "What is the projected 5-year ROI?",
        "Is there institutional investor pricing?",
        "What is the resale value trend?",
      ],
    },
    transcript: "",
    transcript_json: [
      {
        role: "assistant",
        message: "Hello Wei, I'm reaching out about Marina Heights Tower. Do you have a moment?",
        timestamp: 0,
      },
      {
        role: "user",
        message: "Yes. I manage an investment fund. We're looking at Dubai real estate. Tell me about the returns.",
        timestamp: 5,
      },
      {
        role: "assistant",
        message: "Marina Heights offers projected rental yields of 7-8% and the Marina area has seen 12% capital appreciation over the past year. How many units would you be considering?",
        timestamp: 15,
      },
      {
        role: "user",
        message: "Potentially 5 to 10. But I need a formal investment proposal with 5-year projections.",
        timestamp: 28,
      },
      {
        role: "assistant",
        message: "We can absolutely prepare that. I'll connect you with our institutional sales team who specialize in fund-level transactions.",
        timestamp: 38,
      },
      {
        role: "user",
        message: "Good. Have them email me the proposal. We're looking to allocate in Q3.",
        timestamp: 48,
      },
      {
        role: "assistant",
        message: "Noted! Our team will prepare a comprehensive proposal and reach out this week. Thank you, Wei!",
        timestamp: 55,
      },
    ],
  },
];