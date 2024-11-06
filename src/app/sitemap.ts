import { getPosts } from '@/app/utils'
import { baseURL } from '@/app/resources'

export default async function sitemap() {
    let writings = getPosts(['src', 'app', 'writing', 'posts']).map((post) => ({
        url: `${baseURL}/writing/${post.slug}`,
        lastModified: post.metadata.publishedAt,
    }))

    let programmations = getPosts(['src', 'app', 'programmation', 'projects']).map((post) => ({
        url: `${baseURL}/programmation/${post.slug}`,
        lastModified: post.metadata.publishedAt,
    }))

    let experimentalprojs = getPosts(['src', 'app', 'experimentalproj', 'projects']).map((post) => ({
        url: `${baseURL}/experimentalproj/${post.slug}`,
        lastModified: post.metadata.publishedAt,
    }))

    let routes = ['', '/writing', '/programmation', '/music', '/experimentalproj'].map((route) => ({
        url: `${baseURL}${route}`,
        lastModified: new Date().toISOString().split('T')[0],
    }))

    return [...routes, ...writings, ...programmations, ...experimentalprojs]
}