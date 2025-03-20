import axios, { AxiosResponse } from 'axios';

// Define a generic interface for job parameters
interface JenkinsJobParams {
    [key: string]: string | boolean | number | undefined;
}

// Jenkins API configuration
const JENKINS_API_BASE_URL = 'http://your-jenkins-server:8080'; // Replace with your Jenkins URL
const JENKINS_JOB_URL = `${JENKINS_API_BASE_URL}/job/your-job-name/buildWithParameters`; // Replace 'your-job-name'

// Replace these with your actual Jenkins credentials
const JENKINS_USERNAME = 'your-username';
const JENKINS_API_TOKEN = 'your-api-token';

// Create axios instance with basic auth
const jenkinsApi = axios.create({
    baseURL: JENKINS_API_BASE_URL,
    auth: {
        username: JENKINS_USERNAME,
        password: JENKINS_API_TOKEN,
    },
});

/**
 * Trigger Jenkins job with dynamic form parameters using GET
 * @param params Dynamic parameters from executorForm
 * @returns Promise with the API response
 */
export const triggerJenkinsJob = async (params: JenkinsJobParams): Promise<AxiosResponse> => {
    try {
        // Convert all params to uppercase keys (Jenkins convention) and filter out undefined values
        const jenkinsParams = Object.fromEntries(
            Object.entries(params)
                .filter(([_, value]) => value !== undefined)
                .map(([key, value]) => [key.toUpperCase(), String(value)])
        );

        const response = await jenkinsApi.get(JENKINS_JOB_URL, {
            params: jenkinsParams,
        });
        return response;
    } catch (error) {
        console.error('Error triggering Jenkins job:', error);
        throw error;
    }
};