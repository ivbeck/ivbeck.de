import {Octokit} from "octokit";
import type {Endpoints} from "@octokit/types";
import RepositoryGrid, {type Repository} from "./RepositoryGrid";

type GitHubRepo = Endpoints["GET /users/{username}/repos"]["response"]["data"][number];

async function getRepositories(): Promise<Repository[]> {
    const octokit = new Octokit({
        auth: process.env.GITHUB_TOKEN,
    });

    try {
        const response = await octokit.request('GET /users/{username}/repos', {
            username: 'ivbeck',
            sort: 'updated',
            per_page: 15,
            headers: {
                'X-GitHub-Api-Version': '2022-11-28'
            },
            next: {
                revalidate: 3600 // Cache for 1 hour
            }
        });

        return response.data.map((r: GitHubRepo) => ({
            id: r.id,
            name: r.name,
            description: r.description ?? null,
            stargazers_count: r.stargazers_count,
            forks_count: r.forks_count,
            html_url: r.html_url,
        }));
    } catch (error) {
        console.error('Error fetching repositories:', error);
        throw error;
    }
}

export default async function ProjectsPage() {
    const repositories = await getRepositories();

    return (
        <div className="container mx-auto px-4 py-10 md:py-14">
            <div className="mb-8 md:mb-10">
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-500 to-rose-500">My
                    GitHub Projects</h1>
                <p className="mt-2 text-sm md:text-base text-gray-600 dark:text-gray-300">A curated selection of things
                    I build and iterate on. Freshest first.</p>
            </div>
            <RepositoryGrid repositories={repositories}/>
        </div>
    );
}