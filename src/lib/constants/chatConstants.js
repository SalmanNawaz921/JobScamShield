export const chatInputs = [
    {
      name: "",
      type: "text",
      placeholder: "Enter Channel Name",
      required: true,
    },
    {
      name: "description",
      type: "text",
      placeholder: "Enter Description",
    },
    {                                                                                       
      name: "channelType",
      type: "select",
      placeholder: "Enter Channel Type",
      options: [
        {
          name: "General",
          label: "General",
          value: "general",
        },
        {
          name: "Annoucements",
          label: "Annoucements",
          value: "annoucements",
        },
        {
          name: "Events",
          label: "Events",
          value: "events",
        },
      ],
      required: false,
    },
    {
      name: "isPrivate",
      type: "radio",
      placeholder: "What to make this channel private?",
      options: [
        {
          name: "Yes",
          value: "yes",
        },
        {
          name: "No",
          value: "no",
        },
      ],
      required: false,
    },
  ];