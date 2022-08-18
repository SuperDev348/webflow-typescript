export const BUILDER_URL = window.location.origin

export const BASE_ID = [
  {
    id: 'appJ6LHBEjhaorG0k',
    name: 'Care Bundles',
  },
  {
    id: 'appOYFnQSnNcWioWs',
    name: 'LOINC',
  },
]

export const TABLES_LOINC = [
  {
    id: 'tbl158T8gIujpOOW1',
    name: 'Patient',
    fields: [
      {
        id: '1',
        name: 'LOINC_NUM',
      },
      {
        id: '2',
        name: 'COMPONENT',
      },
      {
        id: '3',
        name: 'PROPERTY',
      },
      {
        id: '4',
        name: 'TIME_ASPCT',
      },
      {
        id: '5',
        name: 'SYSTEM',
      },
      {
        id: '6',
        name: 'SCALE_TYP',
      },
      {
        id: '7',
        name: 'METHOD_TYP',
      },
      {
        id: '8',
        name: 'CLASS',
      },
      {
        id: '9',
        name: 'EXAMPLE_UNITS',
      },
      {
        id: '10',
        name: 'LONG_COMMON_NAME',
      },
      {
        id: '11',
        name: 'DisplayName',
      },
    ],
  },
  {
    id: 'tblQP89YJ4Y85djQt',
    name: 'Blood',
    fields: [
      {
        id: '1',
        name: 'LOINC_NUM',
      },
      {
        id: '2',
        name: 'COMPONENT',
      },
      {
        id: '3',
        name: 'PROPERTY',
      },
      {
        id: '4',
        name: 'TIME_ASPCT',
      },
      {
        id: '5',
        name: 'SYSTEM',
      },
      {
        id: '6',
        name: 'SCALE_TYP',
      },
      {
        id: '7',
        name: 'METHOD_TYP',
      },
      {
        id: '8',
        name: 'CLASS',
      },
      {
        id: '9',
        name: 'EXAMPLE_UNITS',
      },
      {
        id: '10',
        name: 'LONG_COMMON_NAME',
      },
      {
        id: '11',
        name: 'DisplayName',
      },
    ],
  },
  {
    id: 'tbl1xvmSChYmjwrTd',
    name: 'Urine',
    fields: [
      {
        id: '1',
        name: 'LOINC_NUM',
      },
      {
        id: '2',
        name: 'COMPONENT',
      },
      {
        id: '3',
        name: 'PROPERTY',
      },
      {
        id: '4',
        name: 'TIME_ASPCT',
      },
      {
        id: '5',
        name: 'SYSTEM',
      },
      {
        id: '6',
        name: 'SCALE_TYP',
      },
      {
        id: '7',
        name: 'METHOD_TYP',
      },
      {
        id: '8',
        name: 'CLASS',
      },
      {
        id: '9',
        name: 'EXAMPLE_UNITS',
      },
      {
        id: '10',
        name: 'LONG_COMMON_NAME',
      },
      {
        id: '11',
        name: 'DisplayName',
      },
    ],
  },
  {
    id: 'tblurjtKjBiJkTTOj',
    name: 'Other',
    fields: [
      {
        id: '1',
        name: 'LOINC_NUM',
      },
      {
        id: '2',
        name: 'COMPONENT',
      },
      {
        id: '3',
        name: 'PROPERTY',
      },
      {
        id: '4',
        name: 'TIME_ASPCT',
      },
      {
        id: '5',
        name: 'SYSTEM',
      },
      {
        id: '6',
        name: 'SCALE_TYP',
      },
      {
        id: '7',
        name: 'METHOD_TYP',
      },
      {
        id: '8',
        name: 'CLASS',
      },
      {
        id: '9',
        name: 'EXAMPLE_UNITS',
      },
      {
        id: '10',
        name: 'LONG_COMMON_NAME',
      },
      {
        id: '11',
        name: 'DisplayName',
      },
    ],
  },
]

export const TABLES_CAREBUNDLES = [
  {
    id: 'tblYNgkrazajAbKrf',
    name: 'BlockTypes',
    fields: [
      {
        id: '1',
        name: 'id',
      },
      {
        id: '2',
        name: 'name',
      },
      {
        id: '3',
        name: 'type',
      },
      {
        id: '4',
        name: 'subtype',
      },
      {
        id: '5',
        name: 'description',
      },
      {
        id: '6',
        name: 'block_template_intro',
      },
      {
        id: '7',
        name: 'block_template_body',
      },
      {
        id: '8',
        name: 'target_resource',
      },
      {
        id: '9',
        name: 'has_select_input',
      },
      {
        id: '10',
        name: 'is_select_input_multi',
      },
      {
        id: '11',
        name: 'select_input_type',
      },
      {
        id: '12',
        name: 'has_text_input',
      },
      {
        id: '13',
        name: 'text_input_title',
      },
      {
        id: '14',
        name: 'icon',
      },
      {
        id: '15',
        name: 'block_icon',
      },
      {
        id: '16',
        name: 'blocks',
      },
      {
        id: '17',
        name: 'can_be_stateless',
      },
      {
        id: '18',
        name: 'block_type_id',
      },
    ],
  },
  {
    id: 'tbldMt06HzOnUgxdA',
    name: 'Criteria',
    fields: [
      {
        id: '1',
        name: 'name',
      },
      {
        id: '2',
        name: 'criteria_id',
      },
      {
        id: '3',
        name: 'source',
      },
      {
        id: '4',
        name: 'operator',
      },
      {
        id: '5',
        name: 'target',
      },
      {
        id: '6',
        name: 'units',
      },
      {
        id: '7',
        name: 'care_bundles',
      },
      {
        id: '8',
        name: 'conditions',
      },
    ],
  },
  {
    id: 'tblzl099uq7ouLZQy',
    name: 'Appointments',
    fields: [
      {
        id: '1',
        name: 'name',
      },
      {
        id: '2',
        name: 'specialty',
      },
      {
        id: '3',
        name: 'within',
      },
      {
        id: '4',
        name: 'care_bundles',
      },
    ],
  },
  {
    id: 'tbl8B5Rlkl2H5hdfP',
    name: 'Calculators',
    fields: [
      {
        id: '1',
        name: 'name',
      },
      {
        id: '2',
        name: 'calculator_id',
      },
      {
        id: '3',
        name: 'Blocks',
      },
    ],
  },
  {
    id: 'tbln38p9EIdT5GXDy',
    name: 'Pathways',
    fields: [
      {
        id: '1',
        name: 'name',
      },
      {
        id: '2',
        name: 'pathway_id',
      },
      {
        id: '3',
        name: 'Blocks',
      },
    ],
  },
  {
    id: 'tblMUHML6XUWUYxVL',
    name: 'Findings',
    fields: [
      {
        id: '1',
        name: 'name',
      },
      {
        id: '2',
        name: 'finding_id',
      },
      {
        id: '3',
        name: 'blocks',
      },
      {
        id: '4',
        name: 'observations',
      },
    ],
  },
  {
    id: 'tblRym1N8sStALn9z',
    name: 'Dosages',
    fields: [
      {
        id: '1',
        name: 'name',
      },
      {
        id: '2',
        name: 'dosage_id',
      },
      {
        id: '3',
        name: 'blocks',
      },
    ],
  },
  {
    id: 'tblpXeCTIydDJYHzY',
    name: 'Keypoints',
    fields: [
      {
        id: '1',
        name: 'name',
      },
      {
        id: '2',
        name: 'keypoint_id',
      },
      {
        id: '3',
        name: 'blocks',
      },
    ],
  },
  {
    id: 'tblldV8PFpO4AeOtD',
    name: 'Tests',
    fields: [
      {
        id: '1',
        name: 'name',
      },
      {
        id: '2',
        name: 'test_id',
      },
      {
        id: '3',
        name: 'blocks',
      },
      {
        id: '4',
        name: 'id',
      },
    ],
  },
  {
    id: 'tblMeJeqOJuxH1SNp',
    name: 'Specialties',
    fields: [
      {
        id: '1',
        name: 'name',
      },
      {
        id: '2',
        name: 'specialty_id',
      },
      {
        id: '3',
        name: 'blocks',
      },
      {
        id: '4',
        name: 'id',
      },
    ],
  },
  {
    id: 'tblUeRkOOmYOp4Nbn',
    name: 'Diseases',
    fields: [
      {
        id: '1',
        name: 'name',
      },
      {
        id: '2',
        name: 'disease_id',
      },
      {
        id: '3',
        name: 'Blocks',
      },
    ],
  },
  {
    id: 'tblsD6GDZOz0me6cb',
    name: 'References',
    fields: [
      {
        id: '1',
        name: 'name',
      },
      {
        id: '2',
        name: 'reference_id',
      },
      {
        id: '3',
        name: 'blocks',
      },
    ],
  },
  {
    id: 'tblT0lCkHZvFgsQg2',
    name: 'Expressions',
    fields: [
      {
        id: '1',
        name: 'name',
      },
      {
        id: '2',
        name: 'type',
      },
      {
        id: '3',
        name: 'blocks',
      },
      {
        id: '4',
        name: 'expression_id',
      },
      {
        id: '5',
        name: 'units',
      },
      {
        id: '6',
        name: 'Bundles',
      },
      {
        id: '7',
        name: 'Bundles 2',
      },
    ],
  },
  {
    id: 'tbleSjQrWdYYvGHAR',
    name: 'Handouts',
    fields: [
      {
        id: '1',
        name: 'name',
      },
      {
        id: '2',
        name: 'handout_id',
      },
      {
        id: '3',
        name: 'Blocks',
      },
    ],
  },
  {
    id: 'tbl3Dd0WSwXOFeEeX',
    name: 'Blocks',
    fields: [
      {
        id: '1',
        name: 'id',
      },
      {
        id: '2',
        name: 'block_type',
      },
      {
        id: '3',
        name: 'findings',
      },
      {
        id: '4',
        name: 'tests',
      },
      {
        id: '5',
        name: 'keypoints',
      },
      {
        id: '6',
        name: 'filters',
      },
      {
        id: '7',
        name: 'created_time',
      },
    ],
  },
  {
    id: 'tbl8ja1fy0Ayp7IN3',
    name: 'Bundles',
    fields: [
      {
        id: '1',
        name: 'name',
      },
      {
        id: '2',
        name: 'id',
      },
      {
        id: '3',
        name: 'protocols',
      },
      {
        id: '4',
        name: 'expression_inclusion',
      },
      {
        id: '5',
        name: 'filters_inclusion',
      },
      {
        id: '6',
        name: 'expression_exclusion',
      },
      {
        id: '7',
        name: 'filters_exclusion',
      },
    ],
  },
  {
    id: 'tbl8ZEMsCfbmf3Xu7',
    name: 'Protocols',
    fields: [
      {
        id: '1',
        name: 'name',
      },
      {
        id: '2',
        name: 'bundles',
      },
      {
        id: '3',
        name: 'id',
      },
      {
        id: '4',
        name: 'blocks',
      },
    ],
  },
  {
    id: 'tblmmIMlV20U9FgFw',
    name: 'Presentations',
    fields: [
      {
        id: '1',
        name: 'name',
      },
      {
        id: '2',
        name: 'id',
      },
      {
        id: '3',
        name: 'finding',
      },
      {
        id: '4',
        name: 'diseases',
      },
      {
        id: '4',
        name: 'blocks',
      },
    ],
  },
  {
    id: 'tblRev1LvcnGoDP2I',
    name: 'Patients',
    fields: [
      {
        id: '1',
        name: 'patient_id',
      },
      {
        id: '2',
        name: 'first_name',
      },
      {
        id: '3',
        name: 'last_name',
      },
      {
        id: '4',
        name: 'date_of_birth',
      },
      {
        id: '5',
        name: 'sex',
      },
      {
        id: '6',
        name: 'pronouns',
      },
      {
        id: '7',
        name: 'phone_number',
      },
      {
        id: '8',
        name: 'address',
      },
      {
        id: '9',
        name: 'city',
      },
      {
        id: '10',
        name: 'province',
      },
      {
        id: '11',
        name: 'country',
      },
      {
        id: '12',
        name: 'notes',
      },
      {
        id: '13',
        name: 'history',
      },
      {
        id: '14',
        name: 'Observations',
      },
    ],
  },
  {
    id: 'tblDiXOdkiFjsCLr6',
    name: 'Users',
    fields: [
      {
        id: '1',
        name: 'name',
      },
      {
        id: '2',
        name: 'title',
      },
      {
        id: '3',
        name: 'license_number',
      },
      {
        id: '4',
        name: 'user_id',
      },
      {
        id: '5',
        name: 'Notes',
      },
      {
        id: '6',
        name: 'History',
      },
      {
        id: '7',
        name: 'Observations',
      },
    ],
  },
  {
    id: 'tblAkkg4PZlvyClAY',
    name: 'Notes',
    fields: [
      {
        id: '1',
        name: 'title',
      },
      {
        id: '2',
        name: 'patient',
      },
      {
        id: '3',
        name: 'user',
      },
      {
        id: '4',
        name: 'date',
      },
      {
        id: '5',
        name: 'pdf',
      },
    ],
  },
  {
    id: 'tblvcUMQams21vYCm',
    name: 'History',
    fields: [
      {
        id: '1',
        name: 'name',
      },
      {
        id: '2',
        name: 'patient',
      },
      {
        id: '3',
        name: 'bundle',
      },
      {
        id: '4',
        name: 'status',
      },
      {
        id: '5',
        name: 'eligable_date',
      },
      {
        id: '6',
        name: 'started_date',
      },
      {
        id: '7',
        name: 'completed_date',
      },
      {
        id: '8',
        name: 'expires',
      },
      {
        id: '9',
        name: 'expires_date',
      },
      {
        id: '10',
        name: 'bundle_id',
      },
    ],
  },
  {
    id: 'tbl0DwHkhUGpt5gRA',
    name: 'Conditions',
    fields: [
      {
        id: '1',
        name: 'name',
      },
      {
        id: '2',
        name: 'criteria',
      },
      {
        id: '3',
        name: 'operator',
      },
    ],
  },
  {
    id: 'tblI9q8cjGsK0rsqT',
    name: 'Periods',
    fields: [
      {
        id: '1',
        name: 'id',
      },
      {
        id: '2',
        name: 'name',
      },
      {
        id: '3',
        name: 'interval',
      },
      {
        id: '4',
        name: 'recurrence',
      },
      {
        id: '5',
        name: 'blocks',
      },
      {
        id: '6',
        name: 'block_id',
      },
    ],
  },
  {
    id: 'tblzLufSS3wZNwN3J',
    name: 'Observations',
    fields: [
      {
        id: '1',
        name: 'id',
      },
      {
        id: '2',
        name: 'patient',
      },
      {
        id: '3',
        name: 'findings',
      },
      {
        id: '4',
        name: 'user',
      },
      {
        id: '5',
        name: 'date',
      },
    ],
  },
]
export const AIRTABLE_URL = 'https://api.airtable.com/v0'
export const AIRTABLE_BASE_URL = 'https://api.airtable.com/v0/appJ6LHBEjhaorG0k'
export const AIRTABLE_CARE_MANAGER_BASE_URL =
  'https://api.airtable.com/v0/appJ6LHBEjhaorG0k'
export const PATHWAY_API_URL = 'https://pathway-api.caprover.do2.pathway.md/v2'

export const token = 'keymneuuZO7FHj0i3'
export const options = {
  headers: {
    Authorization: `Bearer ${token}`,
  },
}

export const pathwayToken = 'key888e01835c199'
export const pathwayApiOptions = {
  headers: {
    Authorization: `Bearer ${pathwayToken}`,
  },
}

export const CardList_Triggers = [
  {
    id: 1,
    name: 'Repeat timer',
    desc: 'Trigger care process at a set recurring period.',
    lefticon: `${BUILDER_URL}/assets/time_elapsed.svg`,
    selectType: 'single',
    targetResource: 'periods',
  },
  {
    id: 2,
    name: 'New patient',
    desc: 'Trigger care process when a new patient is created.',
    lefticon: `${BUILDER_URL}/assets/new_patient_info.svg`,
    selectType: '',
    targetResource: '',
  },
  {
    id: 3,
    name: 'New action',
    desc: 'Trigger care process when a new action is performed.',
    lefticon: `${BUILDER_URL}/assets/new_action.svg`,
    selectType: '',
    targetResource: '',
  },
  {
    id: 4,
    name: 'Await result',
    desc: 'Trigger care process when new result is recorded.',
    lefticon: `${BUILDER_URL}/assets/new_data.svg`,
    selectType: '',
    targetResource: '',
  },
]

export const CardList_Actions = [
  {
    id: 5,
    name: 'Elicit',
    desc: 'Elicit a set of clinical findings from a patient.',
    lefticon: `${BUILDER_URL}/assets/elicit.svg`,
    selectType: 'multi',
    targetResource: 'findings',
  },
  {
    id: 6,
    name: 'Prescribe',
    desc: 'Prescribe one or more medications.',
    lefticon: `${BUILDER_URL}/assets/prescribe.svg`,
    selectType: 'multi',
    targetResource: 'dosages',
  },
  {
    id: 7,
    name: 'Order',
    desc: 'Order a test for a patient.',
    lefticon: `${BUILDER_URL}/assets/order.svg`,
    selectType: 'multi',
    targetResource: 'tests',
  },
  {
    id: 8,
    name: 'Record',
    desc: 'Record one or more diagnoses.',
    lefticon: `${BUILDER_URL}/assets/record.svg`,
    selectType: 'multi',
    targetResource: 'diseases',
  },
  {
    id: 9,
    name: 'Apply',
    desc: 'Apply a guideline recommendation.',
    lefticon: `${BUILDER_URL}/assets/apply.svg`,
    selectType: 'single',
    targetResource: 'keypoints',
  },
  {
    id: 10,
    name: 'Schedule',
    desc: 'Schedule a follow-up visit.',
    lefticon: `${BUILDER_URL}/assets/schedule.svg`,
    selectType: 'single',
    targetResource: 'specialties',
  },
  {
    id: 11,
    name: 'Link',
    desc: 'Link to another care bundle.',
    lefticon: `${BUILDER_URL}/assets/link.svg`,
    selectType: 'single',
    targetResource: 'pathways',
  },
  {
    id: 12,
    name: 'Use',
    desc: 'Use a clinical calculator.',
    lefticon: `${BUILDER_URL}/assets/use.svg`,
    selectType: 'single',
    targetResource: 'calculators',
  },
  {
    id: 13,
    name: 'Custom',
    desc: 'Write a block with custom text.',
    lefticon: `${BUILDER_URL}/assets/custom.svg`,
    selectType: 'multi',
    targetResource: 'references',
  },
  {
    id: 14,
    name: 'Note',
    desc: 'Add a text field for the user to enter a note.',
    lefticon: `${BUILDER_URL}/assets/note.svg`,
    selectType: '',
    targetResource: '',
  },
  {
    id: 15,
    name: 'Differential',
    desc: 'Generate a differential diagnosis.',
    lefticon: `${BUILDER_URL}/assets/use.svg`,
    selectType: 'single',
    targetResource: 'presentations',
  },
]

export const CardList_Structures = [
  {
    id: 16,
    name: 'Start',
    desc: 'Begin care process.',
    lefticon: `${BUILDER_URL}/assets/start.svg`,
    selectType: '',
    targetResource: '',
  },
  {
    id: 17,
    name: 'Filter',
    desc: 'Continue only if a specific condition is met.',
    lefticon: `${BUILDER_URL}/assets/filter.svg`,
    selectType: '',
    targetResource: '',
  },
  {
    id: 18,
    name: 'Branch',
    desc: 'Branch on a specific condition.',
    lefticon: `${BUILDER_URL}/assets/branch.svg`,
    selectType: '',
    targetResource: '',
  },
  {
    id: 19,
    name: 'Choose',
    desc: 'Branch on a specific condition.',
    lefticon: `${BUILDER_URL}/assets/branch.svg`,
    selectType: '',
    targetResource: '',
  },
  {
    id: 20,
    name: 'End',
    desc: 'End care process.',
    lefticon: `${BUILDER_URL}/assets/end.svg`,
    selectType: '',
    targetResource: '',
  },
]

export const CardList_Connects = [
  {
    id: 21,
    name: 'Contact',
    desc: 'Contact a patient by e-mail or by phone.',
    lefticon: `${BUILDER_URL}/assets/contact.svg`,
    selectType: 'single',
    targetResource: 'periods',
  },
  {
    id: 22,
    name: 'Educate',
    desc: 'Send an educational handout to a patient.',
    lefticon: `${BUILDER_URL}/assets/education.svg`,
    selectType: '',
    targetResource: '',
  },
  {
    id: 23,
    name: 'Remind',
    desc: 'Send a reminder to a patient.',
    lefticon: `${BUILDER_URL}/assets/reminder.svg`,
    selectType: '',
    targetResource: '',
  },
]

export const START_BLOCK_TYPE = 'receULDV9Y9o12Gwa'

export const Right_Card = [
  {
    id: 'recfncYn4G187n9wh',
    name: 'Repeat timer',
    lefticon: `${BUILDER_URL}/assets/time_elapsed_blue.svg`,
    desc: 'Trigger care process at a set recurring period.',
    templateTitle: 'Define periods: ',
    template: '${period}',
    begin: 'Every ',
    isMulti: false,
    hasTextInput: false,
    hasSelectInput: true,
  },
  {
    id: 'recrqj6Bnnt1xVh4n',
    name: 'New patient',
    lefticon: `${BUILDER_URL}/assets/new_patient_info_blue.svg`,
    desc: 'Trigger care process when a new patient is created.',
    templateTitle: '',
    template: 'When a new patient is created',
    begin: '',
    isMulti: false,
    hasTextInput: false,
    hasSelectInput: true,
  },
  {
    id: 'recC1egF31qqdfZvo',
    name: 'New action',
    lefticon: `${BUILDER_URL}/assets/new_action_blue.svg`,
    desc: 'Trigger care process when a new action is performed.',
    template: 'When ${condition} is met',
    templateTitle: '',
    begin: '',
    isMulti: false,
    hasTextInput: false,
    hasSelectInput: false,
  },
  {
    id: 'recgrh1HqyGdnF6P4',
    name: 'Await result',
    lefticon: `${BUILDER_URL}/assets/new_data_blue.svg`,
    desc: 'Trigger care process when a new result is available.',
    templateTitle: 'Select one or more tests:',
    template: 'When ${condition} is met',
    begin: '',
    isMulti: false,
    hasTextInput: false,
    hasSelectInput: false,
  },
  {
    id: 'recFlff7nv4x5GeHb',
    name: 'Elicit',
    lefticon: `${BUILDER_URL}/assets/elicit_blue.svg`,
    desc: 'Elicit a set of clinical findings from a patient.',
    templateTitle: 'Select one or more findings:',
    template: '${findings}',
    begin: 'Elicit the following findings: ',
    isMulti: true,
    hasTextInput: false,
    hasSelectInput: true,
  },
  {
    id: 'recYDulWwW95t2jzG',
    name: 'Prescribe',
    lefticon: `${BUILDER_URL}/assets/prescribe_blue.svg`,
    desc: 'Prescribe one or more medications.',
    templateTitle: 'Select one or more dosages:',
    template: '${dosages}',
    begin: 'Write the following prescriptions: ',
    isMulti: true,
    hasTextInput: false,
    hasSelectInput: true,
  },
  {
    id: 'recWyLivc49yUG4I8',
    name: 'Order',
    lefticon: `${BUILDER_URL}/assets/order_blue.svg`,
    desc: 'Order a test for a patient.',
    templateTitle: 'Select one or more tests:',
    template: '${tests}',
    begin: 'Order the following tests: ',
    isMulti: true,
    hasTextInput: false,
    hasSelectInput: true,
  },
  {
    id: 'rec1AbkYCywOlj1tk',
    name: 'Record',
    lefticon: `${BUILDER_URL}/assets/record_blue.svg`,
    desc: 'Record one or more diagnoses.',
    templateTitle: 'Select one or more diseases:',
    template: '${diseases}',
    begin: 'Record the following diagnoses: ',
    isMulti: true,
    hasTextInput: false,
    hasSelectInput: true,
  },
  {
    id: 'recf0K1X1cUHzzzLI',
    name: 'Apply',
    lefticon: `${BUILDER_URL}/assets/apply_blue.svg`,
    desc: 'Apply a guideline recommendation.',
    templateTitle: 'Select a keypoint:',
    template: '${keypoints}',
    begin: 'Apply the following guidelines: ',
    isMulti: false,
    hasTextInput: false,
    hasSelectInput: true,
  },
  {
    id: 'recL9clggSCSPVbWq',
    name: 'Schedule',
    lefticon: `${BUILDER_URL}/assets/schedule_blue.svg`,
    desc: 'Schedule a follow-up visit.',
    templateTitle: 'Select a specialty:',
    template: '${visits}',
    begin: 'Schedule the following visits: ',
    isMulti: false,
    hasTextInput: false,
    hasSelectInput: true,
  },
  {
    id: 'reczByjxdzlstvaIL',
    name: 'Link',
    lefticon: `${BUILDER_URL}/assets/link_blue.svg`,
    desc: 'Link to another care bundle.',
    templateTitle: 'Select a pathway:',
    template: '${bundle}',
    begin: 'Link to this care bundle: ',
    isMulti: false,
    hasTextInput: false,
    hasSelectInput: true,
  },
  {
    id: 'recMyU2ROZ09YVvA3',
    name: 'Use',
    lefticon: `${BUILDER_URL}/assets/use_blue.svg`,
    desc: 'Use a clinical calculator.',
    templateTitle: 'Select a calculator:',
    template: '${calculator}',
    begin: 'Use this calculator: ',
    isMulti: false,
    hasTextInput: false,
    hasSelectInput: true,
  },
  {
    id: 'recYN0nLeXThBf4O5',
    name: 'Custom',
    lefticon: `${BUILDER_URL}/assets/custom_blue.svg`,
    desc: 'Write a block with custom text.',
    templateTitle: 'Custom text:',
    template: '',
    begin: '',
    isMulti: true,
    hasTextInput: true,
    hasSelectInput: true,
  },
  {
    id: 'recCrrDwthcB1wY61',
    name: 'Note',
    desc: 'Enter a block with custom text.',
    lefticon: `${BUILDER_URL}/assets/note_blue.svg`,
    templateTitle: '',
    template: '',
    begin: 'Text input will be placed hereasdf: ',
    isMulti: false,
    hasTextInput: true,
    hasSelectInput: false,
  },
  {
    id: 'recMEeq7a9kvdhlJp',
    name: 'Differential',
    lefticon: `${BUILDER_URL}/assets/use_blue.svg`,
    desc: 'Generate a differential diagnosis.',
    templateTitle: 'Select a presentation: ',
    template: '${presentation}',
    begin: 'Generate a differential diagnosis for: ',
    isMulti: false,
    hasSelectInput: true,
    hasTextInput: false,
  },
  {
    id: 'receULDV9Y9o12Gwa',
    name: 'Start',
    lefticon: `${BUILDER_URL}/assets/start_blue.svg`,
    desc: 'Begin care process.',
    templateTitle: '',
    template: 'Begin care process',
    begin: '',
    isMulti: false,
    hasTextInput: false,
    hasSelectInput: false,
  },
  {
    id: 'recBSHQXsamP6Re51',
    name: 'Filter',
    lefticon: `${BUILDER_URL}/assets/filter_blue.svg`,
    desc: 'Continue only if a specific condition is met.',
    templateTitle: '',
    template: 'When ${condition} is met',
    begin: 'If ',
    isMulti: false,
    hasTextInput: false,
    hasSelectInput: true,
  },
  {
    id: 'recFzs4p5SJ72HA8M',
    name: 'Branch',
    lefticon: `${BUILDER_URL}/assets/branch_blue.svg`,
    desc: 'Continue only if a specific condition is met. ',
    templateTitle: '',
    template: 'If ${expression}',
    begin: '',
    isMulti: false,
    hasSelectInput: true,
    hasTextInput: true,
  },
  {
    id: 'reclGPhiwyIhGMuO6',
    name: 'End',
    lefticon: `${BUILDER_URL}/assets/end_blue.svg`,
    desc: 'End care process.',
    templateTitle: '',
    template: 'End of care process',
    begin: '',
    isMulti: false,
    hasSelectInput: false,
    hasTextInput: false,
  },
  {
    id: 'recUql0CX6UqxM2Je',
    name: 'Contact',
    lefticon: `${BUILDER_URL}/assets/contact_blue.svg`,
    desc: 'Contact a patient by e-mail or by phone.',
    templateTitle: '',
    template: 'Contact by: ',
    begin: '',
    isMulti: false,
    hasSelectInput: false,
    hasTextInput: false,
  },
  {
    id: 'recK49IvPELGK8b4g',
    name: 'Educate',
    lefticon: `${BUILDER_URL}/assets/education_blue.svg`,
    desc: 'Send an educational document to a patient.',
    templateTitle: '',
    template: 'Send the following handout: ',
    begin: '',
    isMulti: false,
    hasSelectInput: true,
    hasTextInput: false,
  },
  {
    id: 'recW2OFCkSdMoBxPT',
    name: 'Remind',
    lefticon: `${BUILDER_URL}/assets/reminder_blue.svg`,
    desc: 'Send a reminder to a patient.',
    templateTitle: '',
    template: 'Send a reminder by: ',
    begin: '',
    isMulti: false,
    hasSelectInput: false,
    hasTextInput: false,
  },
]

export const Filter_Conditions = [
  {
    id: '1',
    name: 'and',
  },
  {
    id: '2',
    name: 'or',
  },
]

export const Filter_System = [
  {
    id: 'tbl158T8gIujpOOW1',
    name: 'Patient',
  },
  {
    id: 'tblQP89YJ4Y85djQt',
    name: 'Blood',
  },
  {
    id: 'tbl1xvmSChYmjwrTd',
    name: 'Urine',
  },
  {
    id: 'tblurjtKjBiJkTTOj',
    name: 'Other',
  },
  {
    id: 'tblUL3odoExuoKdH4',
    name: 'Calculators',
  },
]

export const Recurrence_Names = [
  {
    id: '1',
    name: 'years',
  },
  {
    id: '2',
    name: 'months',
  },
  {
    id: '3',
    name: 'days',
  },
  {
    id: '4',
    name: 'hours',
  },
]
