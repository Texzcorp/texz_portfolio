import { InlineCode } from "@/once-ui/components";

const person = {
    firstName: 'Texz',
    lastName:  'Yo',
    get name() {
        return `${this.firstName} ${this.lastName}`;
    },
    role:      'Multiartiste',
    avatar:    '/images/avatar.jpg',
    location:  'Europe/Paris',        // Expecting the IANA time zone identifier, e.g., 'Europe/Vienna'
    languages: ['French', 'English']  // optional: Leave the array empty if you don't want to display languages
}

const newsletter = {
    display: true,
    title: <>Subscribe to {person.firstName}'s Newsletter</>,
    description: <>I occasionally write about design, technology, and share thoughts on the intersection of creativity and engineering.</>
}

const social = [
    // Links are automatically displayed.
    // Import new icons in /once-ui/icons.ts
    {
        name: 'GitHub',
        icon: 'github',
        link: 'https://github.com/once-ui-system/nextjs-starter',
    },
    {
        name: 'LinkedIn',
        icon: 'linkedin',
        link: 'https://www.linkedin.com/company/once-ui/',
    },
    {
        name: 'X',
        icon: 'x',
        link: '',
    },
    {
        name: 'Email',
        icon: 'email',
        link: 'mailto:example@gmail.com',
    },
]

const home = {
    label: 'Home',
    title: `${person.name}'s Portfolio`,
    description: `Portfolio website showcasing my work as a ${person.role}`,
    headline: <>Design engineer and builder</>,
    subline: <>I'm Selene, a design engineer at <InlineCode>FLY</InlineCode>, where I craft intuitive<br/> user experiences. After hours, I build my own projects.</>
}

const about = {
    label: 'About',
    title: 'About me',
    description: `Meet ${person.name}, ${person.role} from ${person.location}`,
    tableOfContent: {
        display: true,
        subItems: true
    },
    avatar: {
        display: true
    },
    calendar: {
        display: true,
        link: 'https://cal.com'
    },
    intro: {
        display: true,
        title: 'Introduction',
        description: <>Selene is a Jakarta-based design engineer with a passion for transforming complex challenges into simple, elegant design solutions. Her work spans digital interfaces, interactive experiences, and the convergence of design and technology.</>
    },
    work: {
        display: true, // set to false to hide this section
        title: 'Work Experience',
        experiences: [
            {
                company: 'FLY',
                timeframe: '2022 - Present',
                role: 'Senior Design Engineer',
                achievements: [
                    <>Redesigned the UI/UX for the FLY platform, resulting in a 20% increase in user engagement and 30% faster load times.</>,
                    <>Spearheaded the integration of AI tools into design workflows, enabling designers to iterate 50% faster.</>
                ],
                images: [ // optional: leave the array empty if you don't want to display images
                    {
                        src: '/images/projects/project-01/cover-01.jpg',
                        alt: 'Once UI Project',
                        width: 16,
                        height: 9
                    }
                ]
            },
            {
                company: 'Creativ3',
                timeframe: '2018 - 2022',
                role: 'Lead Designer',
                achievements: [
                    <>Developed a design system that unified the brand across multiple platforms, improving design consistency by 40%.</>,
                    <>Led a cross-functional team to launch a new product line, contributing to a 15% increase in overall company revenue.</>
                ],
                images: [ ]
            }
        ]
    },
    studies: {
        display: true, // set to false to hide this section
        title: 'Studies',
        institutions: [
            {
                name: 'University of Jakarta',
                description: <>Studied software engineering.</>,
            },
            {
                name: 'Build the Future',
                description: <>Studied online marketing and personal branding.</>,
            }
        ]
    },
    technical: {
        display: true, // set to false to hide this section
        title: 'Technical skills',
        skills: [
            {
                title: 'Figma',
                description: <>Able to prototype in Figma with Once UI with unnatural speed.</>,
                images: [
                    {
                        src: '/images/projects/project-01/cover-02.jpg',
                        alt: 'Project image',
                        width: 16,
                        height: 9
                    },
                    {
                        src: '/images/projects/project-01/cover-03.jpg',
                        alt: 'Project image',
                        width: 16,
                        height: 9
                    },
                ]
            },
            {
                title: 'Next.js',
                description: <>Building next gen apps with Next.js + Once UI + Supabase.</>,
                images: [
                    {
                        src: '/images/projects/project-01/cover-04.jpg',
                        alt: 'Project image',
                        width: 16,
                        height: 9
                    },
                ]
            }
        ]
    }
}

const blog = {
    label: 'Writing & Narrative Design',
    title: 'Experiences in Narration & Scriptwriting',
    description: `Read what ${person.name} has been up to recently`
    // Create new blog posts by adding a new .mdx file to app/blog/posts
    // All posts will be listed on the /blog route
}

const work = {
    label: 'Video Games & Programming',
    title: 'My video Games & programming projects',
    description: `Design and dev projects by ${person.name}`
    // Create new project pages by adding a new .mdx file to app/blog/posts
    // All projects will be listed on the /home and /work routes
}

const experimentalproj = {
    label: 'Experimental projects',
    title: 'Experimental projects I worked on',
    description: `Experimental projects by ${person.name}`
    // Create new project pages by adding a new .mdx file to app/blog/posts
    // All projects will be listed on the /home and /work routes
}

const music = {
    label: 'Music Production',
    title: 'My musics',
    description: `Design and dev projects by ${person.name}`
    // Create new project pages by adding a new .mdx file to app/blog/posts
    // All projects will be listed on the /home and /work routes
}

const gallery = [
    {
        label: 'Visual Arts',
        preset: 'art3D',
        title: 'My 3D Art Gallery',
        description: `A photo collection by ${person.name}`,
        images: [
            { 
                src: '/images/gallery/img (1).png', 
                alt: 'image',
                orientation: 'Horizontal',
                span: 1 
            },
            { 
                src: '/images/gallery/img (14).png', 
                alt: 'image',
                orientation: 'Horizontal',
                span: 1
            },
            { 
                src: '/images/gallery/video-01.mp4', 
                alt: 'image',
                orientation: 'Horizontal'
            },
        ]
    },
    {
        preset: 'dessins',
        title: 'My Dessins Gallery',
        description: `A photo collection by ${person.name}`,
        images: [
            { 
                src: '/images/gallery/img (4).png', 
                alt: 'image',
                orientation: 'square'
            },
            { 
                src: '/images/gallery/img (5).png', 
                alt: 'image',
                orientation: 'square'
            },
            { 
                src: '/images/gallery/img (6).png', 
                alt: 'image',
                orientation: 'square',
                span: 2
            },
            { 
                src: '/images/gallery/img (7).png', 
                alt: 'image',
                orientation: 'square'
            },
            { 
                src: '/images/gallery/img (10).png', 
                alt: 'image',
                orientation: 'square',
                span: 2
            },
            { 
                src: '/images/gallery/img (11).png', 
                alt: 'image',
                orientation: 'square'
            },
            { 
                src: '/images/gallery/img (3).png', 
                alt: 'image',
                orientation: 'square'
            },
            { 
                src: '/images/gallery/img (14).png', 
                alt: 'image',
                orientation: 'square',
                span: 2
            },
            { 
                src: '/images/gallery/img (8).png', 
                alt: 'image',
                orientation: 'square'
            },
            { 
                src: '/images/gallery/img (1).png', 
                alt: 'image',
                orientation: 'square',
                span: 2
            },
            { 
                src: '/images/gallery/img (9).png', 
                alt: 'image',
                orientation: 'square'
            },
            { 
                src: '/images/gallery/img (2).png', 
                alt: 'image',
                orientation: 'square'
            },
            { 
                src: '/images/gallery/img (12).png', 
                alt: 'image',
                orientation: 'horizontal'
            },
            { 
                src: '/images/gallery/img (13).png', 
                alt: 'image',
                orientation: 'horizontal'
            },

        ]
    },
    {
        preset: 'logo',
        title: 'My Logo Gallery',
        description: `A photo collection by ${person.name}`,
        images: [
            { 
                src: '/images/gallery/img (7).png', 
                alt: 'image',
                orientation: 'square',
                span: 2
            },
            { 
                src: '/images/gallery/img (8).png', 
                alt: 'image',
                orientation: 'square'
            },
            { 
                src: '/images/gallery/img (12).png', 
                alt: 'image',
                orientation: 'square'
            },
            { 
                src: '/images/gallery/img (9).png', 
                alt: 'image',
                orientation: 'square'
            },
            { 
                src: '/images/gallery/img (11).png', 
                alt: 'image',
                orientation: 'square'
            },
            { 
                src: '/images/gallery/img (13).png', 
                alt: 'image',
                orientation: 'square'
            },
            { 
                src: '/images/gallery/img (2).png', 
                alt: 'image',
                orientation: 'square'
            },
        ]
    }
];


export { person, social, newsletter, home, about, blog, work, music, gallery, experimentalproj };