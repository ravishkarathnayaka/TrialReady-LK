import type { TheoryQuestion } from '../types/theory'

export const SRI_LANKA_DMT_QUESTION_BANK: TheoryQuestion[] = [
  // -------------------------------------------------------------
  // 1. Regulatory Road Signs
  // -------------------------------------------------------------
  {
    id: 'q-reg-01',
    category: 'road_signs_regulatory',
    question_text:
      'What does an octagonal red sign with the word "STOP" mean to a driver in Sri Lanka?',
    image_url: '🛑',
    options: [
      'Slow down and proceed if the road is clear',
      'Come to a complete stop before the stop line and yield right of way to all traffic',
      'Stop only if there is a traffic police officer present',
      'Stop for 5 seconds and then accelerate',
    ],
    correct_option_index: 1,
    explanation:
      'The STOP sign is an absolute mandatory regulatory sign. The driver must come to a complete stop before the line and proceed only when clear.',
  },
  {
    id: 'q-reg-02',
    category: 'road_signs_regulatory',
    question_text:
      'What is the meaning of an inverted triangular sign with a red border reading "GIVE WAY"?',
    image_url: '▽',
    options: [
      'You have the priority over all other vehicles',
      'You must slow down or stop to give way to traffic on the major road',
      'No entry for heavy vehicles',
      'Parking allowed for 15 minutes',
    ],
    correct_option_index: 1,
    explanation:
      'The GIVE WAY sign instructs the driver to yield to vehicles approaching on the main road before joining or crossing.',
  },
  {
    id: 'q-reg-03',
    category: 'road_signs_regulatory',
    question_text:
      'A circular sign with a red border containing the number "50" inside indicates:',
    image_url: '⑯ 50',
    options: [
      'Minimum speed limit of 50 km/h',
      'Maximum speed limit of 50 km/h in this road zone',
      'Highway distance to the next town is 50 km',
      'Weight limit of 5.0 tonnes',
    ],
    correct_option_index: 1,
    explanation:
      'Circular signs with red borders indicate prohibitions or maximum restrictions. "50" represents a maximum speed limit of 50 km/h.',
  },
  {
    id: 'q-reg-04',
    category: 'road_signs_regulatory',
    question_text:
      'A circular sign with a white horizontal bar on a solid red background means:',
    image_url: '⛔',
    options: [
      'No Entry for all vehicles',
      'One way road ahead',
      'Road works in progress',
      'Dead end street',
    ],
    correct_option_index: 0,
    explanation:
      'The solid red circle with a horizontal white bar is the international and Sri Lankan "No Entry" sign.',
  },
  {
    id: 'q-reg-05',
    category: 'road_signs_regulatory',
    question_text:
      'What does a circular sign with a blue background showing a white arrow pointing straight ahead indicate?',
    image_url: '⬆️',
    options: [
      'One way road only',
      'Compulsory ahead only (Mandatory straight direction)',
      'Overtaking allowed',
      'U-turn permitted',
    ],
    correct_option_index: 1,
    explanation:
      'Circular signs with blue backgrounds are mandatory signs indicating a compulsory direction of travel.',
  },

  // -------------------------------------------------------------
  // 2. Warning Road Signs
  // -------------------------------------------------------------
  {
    id: 'q-warn-01',
    category: 'road_signs_warning',
    question_text:
      'An equilateral triangular sign with a red border showing a pedestrian on a zebra crossing indicates:',
    image_url: '⚠️ 🚶',
    options: [
      'Pedestrian crossing (Zebra Crossing) ahead; prepare to slow down and stop',
      'Pedestrians prohibited on this road',
      'School playground area',
      'Bus halt ahead',
    ],
    correct_option_index: 0,
    explanation:
      'Warning signs in Sri Lanka are triangular with red borders. This sign warns of an approaching pedestrian crossing.',
  },
  {
    id: 'q-warn-02',
    category: 'road_signs_warning',
    question_text:
      'What action should a driver take when approaching a warning sign showing a circular arrow clockwise?',
    image_url: '⚠️ 🔄',
    options: [
      'Accelerate to merge quickly',
      'Prepare for a roundabout ahead; slow down and give way to traffic from the right',
      'Make an immediate U-turn',
      'Turn on hazard warning lights',
    ],
    correct_option_index: 1,
    explanation:
      'The roundabout warning sign advises drivers to slow down and prepare to yield to vehicles approaching from the right at the upcoming roundabout.',
  },
  {
    id: 'q-warn-03',
    category: 'road_signs_warning',
    question_text:
      'A triangular warning sign displaying an uneven surface or double bumps warns of:',
    image_url: '⚠️ 〰️',
    options: [
      'Steep hill descent',
      'Speed breakers or uneven road surface ahead; reduce speed',
      'Flooded road section',
      'Bridge ahead',
    ],
    correct_option_index: 1,
    explanation:
      'This sign warns drivers of speed bumps, road humps, or rough road conditions ahead.',
  },
  {
    id: 'q-warn-04',
    category: 'road_signs_warning',
    question_text:
      'A triangular sign displaying a railway steam engine or train track indicates:',
    image_url: '⚠️ 🚂',
    options: [
      'Metro station parking',
      'Level crossing (Railway Crossing) ahead; prepare to stop if signals flash',
      'Heavy freight route',
      'End of dual carriageway',
    ],
    correct_option_index: 1,
    explanation:
      'Warns of an upcoming railway level crossing (gated or ungated).',
  },

  // -------------------------------------------------------------
  // 3. Priority & Junctions
  // -------------------------------------------------------------
  {
    id: 'q-prio-01',
    category: 'priority_and_junctions',
    question_text:
      'At an uncontrolled junction or roundabout in Sri Lanka (left-hand driving), who has the right of way?',
    options: [
      'The vehicle travelling at the highest speed',
      'Traffic approaching from your right-hand side',
      'The larger vehicle or bus',
      'Traffic approaching from your left-hand side',
    ],
    correct_option_index: 1,
    explanation:
      'Under the Sri Lanka Motor Traffic Act, drivers must give way to traffic approaching from their right at roundabouts and equal priority intersections.',
  },
  {
    id: 'q-prio-02',
    category: 'priority_and_junctions',
    question_text:
      'When are you allowed to enter a yellow criss-cross box junction on the road?',
    options: [
      'At any time if traffic lights are green',
      'Only when your exit road is clear and you can cross without stopping inside the box',
      'Whenever following a public bus',
      'If you plan to turn right and wait for oncoming traffic',
    ],
    correct_option_index: 1,
    explanation:
      'You must NOT enter a yellow box junction unless your exit is completely clear, except when turning right and waiting only for oncoming vehicles.',
  },
  {
    id: 'q-prio-03',
    category: 'priority_and_junctions',
    question_text:
      'What does a continuous solid single white line in the center of a two-way road mean?',
    options: [
      'Overtaking is permitted at any time',
      'You must not cross or straddle the line to overtake another vehicle',
      'Parking is permitted on the right side',
      'Speed limit is 70 km/h',
    ],
    correct_option_index: 1,
    explanation:
      'A solid white dividing line strictly prohibits crossing or straddling to overtake because visibility is restricted.',
  },
  {
    id: 'q-prio-04',
    category: 'priority_and_junctions',
    question_text:
      'When an emergency vehicle (Ambulance, Fire Brigade, Police) approaches with sirens or flashing lights, what must you do?',
    options: [
      'Accelerate to clear the road ahead of them',
      'Immediately move to the left side of the road, slow down, and stop if necessary to allow clear passage',
      'Maintain your lane and normal speed',
      'Turn on your hazard lights and brake hard in the middle of the road',
    ],
    correct_option_index: 1,
    explanation:
      'Drivers must immediately yield right of way by pulling over safely to the left edge of the carriageway.',
  },

  // -------------------------------------------------------------
  // 4. General Road Safety & DMT Laws
  // -------------------------------------------------------------
  {
    id: 'q-law-01',
    category: 'general_road_safety',
    question_text:
      'What is the minimum safe following distance rule in normal dry driving conditions?',
    options: [
      '1 second distance behind the vehicle ahead',
      'The 2-Second Rule (increasing to 4 seconds in wet conditions)',
      '1 meter for every 10 km/h speed',
      'Stay as close as possible to prevent other vehicles from cutting in',
    ],
    correct_option_index: 1,
    explanation:
      'The 2-second rule provides adequate reaction time and braking distance in normal conditions.',
  },
  {
    id: 'q-law-02',
    category: 'general_road_safety',
    question_text:
      'When driving in Sri Lanka, who is legally required to wear a seatbelt in a motor car?',
    options: [
      'Only the driver',
      'Both the driver and the front-seat passenger',
      'Only passengers travelling on expressways',
      'Seatbelts are optional during daytime',
    ],
    correct_option_index: 1,
    explanation:
      'Under Sri Lankan traffic regulations, wearing seatbelts is compulsory for the driver and front-seat passengers.',
  },
  {
    id: 'q-law-03',
    category: 'general_road_safety',
    question_text:
      'What is the legal blood alcohol concentration (BAC) limit for driving a motor vehicle in Sri Lanka?',
    options: [
      '0.06 grams per 100 milliliters of blood (0.06% BAC)',
      '0.15 grams per 100 milliliters of blood',
      '0.50 grams per 100 milliliters of blood',
      'There is no legal limit if driving carefully',
    ],
    correct_option_index: 0,
    explanation:
      'Under the Sri Lanka Motor Traffic Act, the legal threshold for blood alcohol concentration is 0.06g/100ml. Driving above this limit is a criminal offense.',
  },
  {
    id: 'q-law-04',
    category: 'general_road_safety',
    question_text:
      'When driving at night on an unlit road, when MUST you dip your high-beam headlights to low-beam?',
    options: [
      'Only when you see a police patrol',
      'When following another vehicle or when an oncoming vehicle approaches within 200 meters',
      'Only when turning at a junction',
      'Never, keep high-beams on for maximum visibility',
    ],
    correct_option_index: 1,
    explanation:
      'High-beams dazzle other drivers; you must switch to low-beam when following another vehicle or when an oncoming vehicle approaches.',
  },

  // -------------------------------------------------------------
  // 5. Vehicle Controls & Mechanics
  // -------------------------------------------------------------
  {
    id: 'q-ctrl-01',
    category: 'vehicle_mechanics_controls',
    question_text:
      'What should a driver do if their vehicle begins to skid on a wet or slippery road surface?',
    options: [
      'Slam hard on the footbrake and pull the handbrake immediately',
      'Release the accelerator gently and steer smoothly in the direction of the skid without harsh braking',
      'Accelerate quickly to regain traction',
      'Turn the steering wheel rapidly back and forth',
    ],
    correct_option_index: 1,
    explanation:
      'Sudden braking exacerbates skidding. Ease off the throttle and steer smoothly into the direction of the skid to regain tyre grip.',
  },
  {
    id: 'q-ctrl-02',
    category: 'vehicle_mechanics_controls',
    question_text:
      'What is the primary purpose of an Anti-lock Braking System (ABS) during emergency braking?',
    options: [
      'To make the car stop in half the distance',
      'To prevent the wheels from locking up, allowing the driver to maintain steering control',
      'To automatically apply the handbrake',
      'To turn off the engine during sudden stops',
    ],
    correct_option_index: 1,
    explanation:
      'ABS rapidly pulses braking pressure to prevent wheels from locking, enabling the driver to steer around obstacles during hard braking.',
  },
]
