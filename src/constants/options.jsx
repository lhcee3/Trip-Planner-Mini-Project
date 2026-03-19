export const SelectTravelList = [
    {
        id:1,
        title: 'Solo',
        desc: 'Traveling alone',
        people:'1 person'
    },
    {
        id:2,
        title: 'Couple',
        desc: 'Two travelers',
        people:'2 people'
    },
    {
        id:3,
        title: 'Family',
        desc: 'Group with kids',
        people:'3 to 5 People'
    },
    {
        id:4,
        title: 'Friends',
        desc: 'Group of friends',
        people:'5 to 10 people'
    }
]

export const SelectBudgetOptions = [
    {
        id:1,
        title: 'Budget',
        desc: 'Cost-conscious travel',
    },
    {
        id:2,
        title: 'Moderate',
        desc: 'Balanced spending',
    },
    {
        id:3,
        title: 'Luxury',
        desc: 'No budget limits',
    }
]

export const AI_PROMPT = `Generate a detailed travel plan for {location}, for {totalDays} days, for {traveler}, with a {budget} budget.

Return ONLY valid JSON in this exact structure:
{
  "destination": "city, country",
  "overview": "2-3 sentence intro about the destination and trip style",
  "tips": ["tip 1", "tip 2", "tip 3"],
  "hotel_options": [
    {
      "name": "Hotel Name",
      "address": "full address",
      "price": "price per night in USD",
      "rating": "4.5",
      "description": "short description",
      "booking_url": "https://www.google.com/maps/search/?api=1&query=Hotel+Name+City"
    }
  ],
  "itinerary": [
    {
      "day": "Day 1",
      "theme": "short theme title",
      "summary": "1-2 sentence overview of the day",
      "plan": [
        {
          "time": "Morning",
          "place": "Place Name",
          "details": "Detailed description of what to do here, why it is worth visiting, and practical tips.",
          "ticket_pricing": "Free or price",
          "rating": "4.5",
          "geo_coordinates": {"lat": 0.0, "lng": 0.0}
        }
      ]
    }
  ]
}

Respond with valid JSON only, no explanation or extra text.`