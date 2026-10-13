import { getPosts } from '@/app/utils'
import { baseURL, routes as enabledRoutes } from '@/app/resources'

export default async function sitemap() {
    let writings = getPosts(['src', 'app', 'writing', 'posts']).map((post) => ({
        url: `https://${baseURL}/writing/${post.slug}`,
        lastModified: post.metadata.publishedAt,
    }))

    let programmations = getPosts(['src', 'app', 'programmation', 'projects']).map((post) => ({
        url: `https://${baseURL}/programmation/${post.slug}`,
        lastModified: post.metadata.publishedAt,
    }))

    let experimentalprojs = getPosts(['src', 'app', 'experimentalproj', 'projects']).map((post) => ({
        url: `https://${baseURL}/experimentalproj/${post.slug}`,
        lastModified: post.metadata.publishedAt,
    }))

    let music = getPosts(['src', 'app', 'music', 'projects']).map((post) => ({
        url: `https://${baseURL}/music/${post.slug}`,
        lastModified: post.metadata.publishedAt,
    }))

    let routes = Object.entries(enabledRoutes).filter(([, enabled]) => enabled).map(([route]) => ({
        url: `https://${baseURL}${route}`,
        lastModified: new Date().toISOString().split('T')[0],
    }))

    return [...routes, ...writings, ...programmations, ...experimentalprojs, ...music]
}
