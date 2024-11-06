import { InlineCode } from "@/once-ui/components";

const person = {
    firstName: 'Terence',
    lastName:  'Diaz',
    get name() {
        return `${this.firstName} ${this.lastName}`;
    },
    role:      'Multidisciplinary Artist and Creative Developer',
    avatar:    '/images/avatar.jpg',
    location:  'Europe/Paris',        // Expecting the IANA time zone identifier, e.g., 'Europe/Vienna'
    languages: ['French', 'English']  // optional: Leave the array empty if you don't want to display languages
}

const newsletter = {
    display: false,
    title: <>Subscribe to {person.firstName}'s Newsletter</>,
    description: <>I occasionally write about design, technology, and share thoughts on the intersection of creativity and engineering.</>
}

const social = [
    // Links are automatically displayed.
    // Import new icons in /once-ui/icons.ts
    {
        name: 'GitHub',
        icon: 'github',
        link: 'https://github.com/Texzcorp',
    },
    {
        name: 'Youtube Music',
        icon: 'youtube',
        link: 'https://www.youtube.com/@texzmusic9981',
    },
    {
        name: 'X',
        icon: 'x',
        link: '',
    },
    {
        name: 'Email',
        icon: 'email',
        link: 'mailto:texzcorp@gmail.com',
    },
]

const home = {
    label: 'Home',
    title: `${person.name}'s Portfolio`,
    description: `Portfolio website showcasing my work as a ${person.role}`,
    headline: <>Multidisciplinary Artist and Creative Developer</>,
    subline: <>A creator pushing boundaries in game development, music, visual arts, and experimental projects.<br/> Explore my projects from experimental designs to professional work.</>
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
        description: <>A multidisciplinary creator with deep technical expertise, seamlessly blending game development, software engineering, music production, and digital art. Driven by a relentless curiosity for mastering diverse tools and technologies, each project is an exploration of pushing boundaries and reimagining what’s achievable across multiple creative realms. </>
    },
    programmation: {
        display: true, // set to false to hide this section
        title: 'Virtual production',
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
            },
            {
                company: 'test',
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
        title: 'Music',
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
    writing: {
        display: true, // set to false to hide this section
        title: 'Narration & Scriptwriting',
    },
    progvideogames: {
        display: true, // set to false to hide this section
        title: 'Programmation & video games',
    },
    technical: {
        display: true, // set to false to hide this section
        title: 'Technical skills',
        skills: [
            {
                title: 'Unreal Engine',
                description: <>Technical and artistic skills in virtual production and video game development using Unreal Engine.</>,
                images: [
                    {
                        src: '/images/projects/technical/UE1.jpg',
                        alt: 'Project image',
                        width: 16,
                        height: 9
                    },
                    {
                        src: '/images/projects/technical/UE2.jpg',
                        alt: 'Project image',
                        width: 16,
                        height: 9
                    },
                    {
                        src: '/images/projects/technical/UE3.jpg',
                        alt: 'Project image',
                        width: 16,
                        height: 9
                    },
                ]
            },
            {
                title: 'Python',
                description: <>Creation of tools and micro-software to enhance productivity using Python.</>,
                images: [
                    {
                        src: '/images/projects/technical/Python1.jpg',
                        alt: 'Project image',
                        width: 16,
                        height: 9
                    },
                    {
                        src: '/images/projects/technical/Python2.jpg',
                        alt: 'Project image',
                        width: 16,
                        height: 9
                    },
                ]
            },
            {
                title: 'Reaper',
                description: <>Musical composition with Reaper</>,
                images: [
                    {
                        src: '/images/projects/technical/Reaper1.jpg',
                        alt: 'Project image',
                        width: 16,
                        height: 9
                    },
                    {
                        src: '/images/projects/technical/Reaper2.jpg',
                        alt: 'Project image',
                        width: 16,
                        height: 9
                    },
                ]
            },
            {
                title: 'GIMP',
                description: <>Extensive skills in image editing, drawing, and design using GIMP.</>,
                images: [
                    {
                        src: '/images/projects/technical/Gimp1.jpg',
                        alt: 'Project image',
                        width: 16,
                        height: 9
                    },
                    {
                        src: '/images/projects/technical/Gimp2.jpg',
                        alt: 'Project image',
                        width: 16,
                        height: 9
                    },
                ]
            }
        ]
    },
}

const writing = {
    label: 'Writing',
    title: 'Experiences in Narration & Scriptwriting',
    description: `Read what ${person.name} has been up to recently`
    // Create new writing posts by adding a new .mdx file to app/writing/posts
    // All posts will be listed on the /writing route
}

const programmation = {
    label: 'Dev & Games',
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
    label: 'Music',
    title: 'My musics',
    description: `Design and dev projects by ${person.name}`
    // Create new project pages by adding a new .mdx file to app/blog/posts
    // All projects will be listed on the /home and /work routes
}

const gallery = [
    {
        label: 'Visual Arts',
        preset: 'art3D',
        title: 'My Virtual Production Gallery',
        description: `Some scenes made with unreal engine 5`,
        images: [
            { 
                src: '/images/gallery/virtual-prod/RND (2).mp4', 
                alt: 'image',
                orientation: 'Horizontal',
                span: 1 
            },
            { 
                src: '/images/gallery/virtual-prod/RND (3).mp4', 
                alt: 'image',
                orientation: 'Horizontal',
                span: 1
            },
            { 
                src: '/images/gallery/virtual-prod/RND (1).mp4', 
                alt: 'image',
                orientation: 'Horizontal'
            },
        ]
    },
    {
        preset: 'dessins',
        title: 'My drawings gallery',
        description: `Some drawings I made`,
        images: [
            { 
                src: '/images/gallery/dessins/img (4).jpg', 
                alt: 'image',
                orientation: 'square'
            },
            { 
                src: '/images/gallery/dessins/img (5).jpg', 
                alt: 'image',
                orientation: 'square'
            },
            { 
                src: '/images/gallery/dessins/img (6).jpg', 
                alt: 'image',
                orientation: 'square',
                span: 2
            },
            { 
                src: '/images/gallery/dessins/img (7).jpg', 
                alt: 'image',
                orientation: 'square'
            },
            { 
                src: '/images/gallery/dessins/img (10).jpg', 
                alt: 'image',
                orientation: 'square',
                span: 2
            },
            { 
                src: '/images/gallery/dessins/img (11).jpg', 
                alt: 'image',
                orientation: 'square'
            },
            { 
                src: '/images/gallery/dessins/img (3).jpg', 
                alt: 'image',
                orientation: 'square'
            },
            { 
                src: '/images/gallery/dessins/img (14).jpg', 
                alt: 'image',
                orientation: 'square',
                span: 2
            },
            { 
                src: '/images/gallery/dessins/img (8).jpg', 
                alt: 'image',
                orientation: 'square'
            },
            { 
                src: '/images/gallery/dessins/img (1).jpg', 
                alt: 'image',
                orientation: 'square',
                span: 2
            },
            { 
                src: '/images/gallery/dessins/img (9).jpg', 
                alt: 'image',
                orientation: 'square'
            },
            { 
                src: '/images/gallery/dessins/img (2).jpg', 
                alt: 'image',
                orientation: 'square'
            },
            { 
                src: '/images/gallery/dessins/img (12).jpg', 
                alt: 'image',
                orientation: 'horizontal'
            },
            { 
                src: '/images/gallery/dessins/img (13).jpg', 
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
                src: '/images/gallery/logo/Texz (1).jpg', 
                alt: 'image',
                orientation: 'square',
                span: 2
            },
            { 
                src: '/images/gallery/logo/Texz (2).jpg', 
                alt: 'image',
                orientation: 'square'
            },
            { 
                src: '/images/gallery/logo/Texz (3).jpg', 
                alt: 'image',
                orientation: 'square'
            },
            { 
                src: '/images/gallery/logo/Texz (4).jpg', 
                alt: 'image',
                orientation: 'square'
            },
            { 
                src: '/images/gallery/logo/Barba (1).jpg', 
                alt: 'image',
                orientation: 'square'
            },
            { 
                src: '/images/gallery/logo/Din.jpg', 
                alt: 'image',
                orientation: 'square'
            },
            { 
                src: '/images/gallery/logo/RCD (2).jpg', 
                alt: 'image',
                orientation: 'square'
            },
            { 
                src: '/images/gallery/logo/Barba (2).jpg', 
                alt: 'image',
                orientation: 'square'
            },
            { 
                src: '/images/gallery/logo/Barba (3).jpg', 
                alt: 'image',
                orientation: 'square'
            },
            { 
                src: '/images/gallery/logo/RCD (1).jpg', 
                alt: 'image',
                orientation: 'square'
            },
            { 
                src: '/images/gallery/logo/RCD (3).jpg', 
                alt: 'image',
                orientation: 'square'
            },
            { 
                src: '/images/gallery/logo/Recul.jpg', 
                alt: 'image',
                orientation: 'square'
            },
            
            
            { 
                src: '/images/gallery/logo/KAIROS.jpg', 
                alt: 'image',
                orientation: 'square'
            },
            { 
                src: '/images/gallery/logo/Shaker.jpg', 
                alt: 'image',
                orientation: 'square'
            },
            { 
                src: '/images/gallery/logo/infody (2).jpg', 
                alt: 'image',
                orientation: 'square'
            },
            { 
                src: '/images/gallery/logo/infody (1).jpg', 
                alt: 'image',
                orientation: 'horizontal',
            },
            
        ]
    }
];


export { person, social, newsletter, home, about, writing, programmation, music, gallery, experimentalproj };