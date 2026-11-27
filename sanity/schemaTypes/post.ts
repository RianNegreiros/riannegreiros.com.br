export default {
  name: 'post',
  type: 'document',
  title: 'Post',
  fields: [
    {
      name: 'language',
      type: 'string',
      title: 'Language',
      description:
        'Posts without a language are treated as Portuguese. Create the English version as a separate post and point it to the original below.',
      options: {
        list: [
          {title: 'Português', value: 'pt'},
          {title: 'English', value: 'en'},
        ],
        layout: 'radio',
      },
      initialValue: 'pt',
    },
    {
      name: 'translationOf',
      type: 'reference',
      title: 'Translation of',
      description: 'The original Portuguese post this English post translates.',
      to: [{type: 'post'}],
      options: {
        filter: "_type == 'post' && coalesce(language, 'pt') == 'pt'",
      },
      hidden: ({document}: {document?: {language?: string}}) => document?.language !== 'en',
      validation: (Rule: any) =>
        Rule.custom((value: unknown, ctx: {document?: {language?: string}}) =>
          ctx.document?.language === 'en' && !value
            ? 'Select the Portuguese original'
            : true,
        ),
    },
    {
      name: 'title',
      type: 'string',
      title: 'Title',
    },
    {
      name: 'overview',
      type: 'string',
      title: 'Overview',
    },
    {
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      options: {
        source: 'title',
      },
    },
    {
      name: 'firstPublishedDate',
      type: 'datetime',
      title: 'First Published Date',
    },
    {
      name: 'image',
      type: 'image',
      title: 'Image',
    },
    {
      name: 'content',
      type: 'array',
      title: 'Content',
      of: [
        {
          type: 'block',
        },
        {
          type: 'image',
          fields: [
            {
              type: 'text',
              name: 'alt',
              title: 'Alternative Text',
            },
          ],
        },
        {
          type: 'code',
          name: 'code',
          title: 'Code',
          options: {
            withFilename: true,
            highlightedLines: true,
          },
        },
        {
          name: 'video',
          type: 'file',
          title: 'Video',
          description: 'Upload MP4 video files',
          options: {
            accept: 'video/mp4',
          },
        },
      ],
    },
  ],
}
