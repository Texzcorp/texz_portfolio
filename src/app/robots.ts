import { baseURL } from '@/app/resources'

export default function robots() {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: '/api/',
            },
        ],
        sitemap: `https://${baseURL}/sitemap.xml`,
    }
}
