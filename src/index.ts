import fetch from 'node-fetch';
import { Encoder } from 'nai-js-tokenizer';
import { components } from './api'

// Tokenizer

interface Vocabulary {
    [key: string]: number
}

interface TokenizerConfig {
    splitRegex: string
}

interface DataEncoder {
    [key: string]: number
}

interface DataDecoder {
    [key: number]: string
}

interface GPTPair {
    left: string
    right: string
}

interface BGERank {
    rank: number
    bigram: GPTPair
}

interface SpecialsTreeNode {
    char: string
    children: SpecialsTreeNode[]
    value?: string
}

interface TokenizerDefinition {
    vocab: Vocabulary,
    merges: string[][],
    specialTokens: string[],
    config: TokenizerConfig
}
const NerdstashV2 = require('./nerdstashv2.json') as TokenizerDefinition;
export const Tokenizer = new Encoder(NerdstashV2.vocab,NerdstashV2.merges,NerdstashV2.specialTokens,NerdstashV2.config);
export function textToTokens(text: string) : string
{
    return Buffer.from((new Uint16Array(Tokenizer.encode(text))).buffer).toString('base64');
}
export function tokensToText(base64: string) : string
{
    const buff = Buffer.from(base64,'base64');
    const uarray = new Uint16Array(buff.buffer,buff.byteOffset,buff.length/2);
    return Tokenizer.decode([...uarray]);
}

// NAI types

export type Model = "2.7B" | "6B-v4" | "euterpe-v2" | "genji-python-6b" | "genji-jp-6b" | "genji-jp-6b-v2" | "krake-v2" | "hypebot" | "infillmodel" | "cassandra" | "sigurd-2.9b-v1" | "blue" | "red" | "green" | "purple" | "clio-v1" | "kayra-v1";
export type ApiError = components['schemas']['ApiError'];
export type AccountInformationResponse = components['schemas']['AccountInformationResponse'];
export type AiAnnotateImageRequest = components['schemas']['AiAnnotateImageRequest'];
export type AiGenerateImageRequest = components['schemas']['AiGenerateImageRequest'];
export type AiGenerateImageResponse = components['schemas']['AiGenerateImageResponse'];
export type AiGenerateParameters = components['schemas']['AiGenerateParameters'];
export type AiGeneratePromptRequest = components['schemas']['AiGeneratePromptRequest'];
export type AiGeneratePromptResponse = components['schemas']['AiGeneratePromptResponse'];
export type AiGenerateRequest = components['schemas']['AiGenerateRequest'];
export type AiGenerateResponse = components['schemas']['AiGenerateResponse'];
export type AiGenerateStreamableResponse = components['schemas']['AiGenerateStreamableResponse'];
export type AiModuleDto = components['schemas']['AiModuleDto'];
export type AiModuleTrainRequest = components['schemas']['AiModuleTrainRequest'];
export type AiRequestImageGenerationTag = components['schemas']['AiRequestImageGenerationTag'];
export type AiRequestImageGenerationTagsResponse = components['schemas']['AiRequestImageGenerationTagsResponse'];
export type AiSequenceClassificationResponse = components['schemas']['AiSequenceClassificationResponse'];
export type AiUpscaleImageRequest = components['schemas']['AiUpscaleImageRequest'];
export type BindSubscriptionRequest = components['schemas']['BindSubscriptionRequest'];
export type BuyTrainingStepsRequest = components['schemas']['BuyTrainingStepsRequest'];
export type ChangeAccessKeyRequest = components['schemas']['ChangeAccessKeyRequest'];
export type ChangeSubscriptionPlanRequest = components['schemas']['ChangeSubscriptionPlanRequest'];
export type CreatePersistentTokenInput = components['schemas']['CreatePersistentTokenInput'];
export type CreatePersistentTokenResponse = components['schemas']['CreatePersistentTokenResponse'];
export type CreateUserRequest = components['schemas']['CreateUserRequest'];
export type DeletionFinishRequest = components['schemas']['DeletionFinishRequest'];
export type DeletionStartRequest = components['schemas']['DeletionStartRequest'];
export type EmailVerificationRequest = components['schemas']['EmailVerificationRequest'];
export type EmailVerificationStartRequest = components['schemas']['EmailVerificationStartRequest'];
export type GetKeystoreResponse = components['schemas']['GetKeystoreResponse'];
export type GiftKeysResponse = components['schemas']['GiftKeysResponse'];
export type LoginRequest = components['schemas']['LoginRequest'];
export type ObjectsResponse = components['schemas']['ObjectsResponse'];
export type PriorityResponse = components['schemas']['PriorityResponse'];
export type RecoveryFinishRequest = components['schemas']['RecoveryFinishRequest'];
export type RecoveryStartRequest = components['schemas']['RecoveryStartRequest'];
export type SubscriptionAvailableTrainingSteps = components['schemas']['SubscriptionAvailableTrainingSteps'];
export type SubscriptionResponse = components['schemas']['SubscriptionResponse'];
export type SubscriptionTierPerks = components['schemas']['SubscriptionTierPerks'];
export type SuccessfulLoginResponse = components['schemas']['SuccessfulLoginResponse'];
export type UpdateKeystoreRequest = components['schemas']['UpdateKeystoreRequest'];
export type UserAccountDataResponse = components['schemas']['UserAccountDataResponse'];
export type UserData = components['schemas']['UserData'];
export type UserDataInput = components['schemas']['UserDataInput'];
export type UserSubmissionInput = components['schemas']['UserSubmissionInput'];
export type UserSubmissionVoteInput = components['schemas']['UserSubmissionVoteInput'];

// Functions

export function getKayraMaxContextTokens(tier: number) : number | null {
    switch (tier) {
        case 1:
            return 3072;
        case 2:
            return 6144;
        case 3:
            return 8192;
    }

    return null;
}
export type NaiResponse<T> = { result: T, status_code : number };
export type AsyncNaiResponse<T> = Promise<NaiResponse<T>>;
const API_NOVELAI = 'https://api.novelai.net';
async function interactWithAPI<T>(api_key_novel: string, method: string, verb: string, requestBody : object | any[] | undefined = undefined) : AsyncNaiResponse<T> {
    let resp;
    if(requestBody === undefined) {
        resp = (await fetch(API_NOVELAI + verb, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + api_key_novel,
            }
        }));
    } else {
        resp =  (await fetch(API_NOVELAI + verb, {
            body: JSON.stringify(requestBody),
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + api_key_novel,
            }
        }));
    }
    return { result: await resp.json() as T, status_code: resp.status };
}
export async function healthCheck() : Promise<boolean> {
    const resp = await fetch(API_NOVELAI + '/', {
        method: 'GET'
    });
    return resp.status == 200;
}
function encodeData(data: any) {
    return Object.keys(data).map(function(key) {
        return [key, data[key]].map(encodeURIComponent).join("=");
    }).join("&");
}
export async function aiGenerate(api_key_novel: string, prompt: AiGenerateRequest) : AsyncNaiResponse<AiGenerateResponse | ApiError> {
    return await interactWithAPI<AiGenerateResponse | ApiError>(api_key_novel, 'POST', '/ai/generate', prompt);
}
export async function aiGenerateImage(api_key_novel: string, prompt: AiGenerateImageRequest) : AsyncNaiResponse<AiGenerateImageResponse | ApiError> {
    return await interactWithAPI<AiGenerateImageResponse | ApiError>(api_key_novel, 'POST', '/ai/generate-image', prompt);
}
export async function aiGeneratePrompt(api_key_novel: string, prompt: AiGeneratePromptRequest) : AsyncNaiResponse<AiGeneratePromptResponse | ApiError> {
    return await interactWithAPI<AiGeneratePromptResponse | ApiError>(api_key_novel, 'POST', '/ai/generate-prompt', prompt);
}
export async function aiGenerateStreamable(api_key_novel: string, prompt: AiGenerateRequest) : AsyncNaiResponse<AiGenerateStreamableResponse | ApiError> {
    return await interactWithAPI<AiGenerateStreamableResponse | ApiError>(api_key_novel, 'POST', '/ai/generate-stream', prompt);
}
export async function aiUpscaleImage(api_key_novel: string, prompt: AiUpscaleImageRequest) : AsyncNaiResponse<never | ApiError> {
    return await interactWithAPI<never | ApiError>(api_key_novel, 'POST', '/ai/upscale', prompt);
}
export async function annotateImage(api_key_novel: string, prompt: AiAnnotateImageRequest) : AsyncNaiResponse<AiGenerateStreamableResponse | ApiError> {
    return await interactWithAPI<never | ApiError>(api_key_novel, 'POST', '/ai/annotate-image', prompt);
}
export async function classify(api_key_novel: string) : AsyncNaiResponse<AiSequenceClassificationResponse | ApiError> {
    return await interactWithAPI<never | ApiError>(api_key_novel, 'POST', '/ai/classify');
}
export interface AiRequestImageGenerationQuery {
    model: string;
    prompt: string;
}
export async function generateImageTags(api_key_novel: string, prompt: AiRequestImageGenerationQuery) : AsyncNaiResponse<AiRequestImageGenerationTagsResponse | ApiError> {
    return await interactWithAPI<AiRequestImageGenerationTagsResponse | ApiError>(api_key_novel, 'GET', '/ai/generate-image/suggest-tags?' + encodeData(prompt));
}
export interface AiVoiceQuery {
    text: string;
    seed: string;
    voice: number;
    opus: boolean;
    version: string;
}
export async function generateVoice(api_key_novel: string, prompt: AiVoiceQuery) : AsyncNaiResponse<never | ApiError> {
    return await interactWithAPI<never | ApiError>(api_key_novel, 'GET', '/ai/generate-voice?' + encodeData(prompt));
}
export async function allModules(api_key_novel: string) : AsyncNaiResponse<AiModuleDto | ApiError> {
    return await interactWithAPI<AiModuleDto | ApiError>(api_key_novel, 'GET', '/ai/module/all');
}
export async function buyTrainingSteps(api_key_novel: string, prompt: BuyTrainingStepsRequest) : AsyncNaiResponse<never | ApiError> {
    return await interactWithAPI<never | ApiError>(api_key_novel, 'POST', '/ai/module/buy-training-steps', prompt);
}
export async function deleteModule(api_key_novel: string, id: string) : AsyncNaiResponse<never | ApiError> {
    return await interactWithAPI<never | ApiError>(api_key_novel, 'DELETE', '/ai/module/' + id);
}
export async function getModule(api_key_novel: string, id: string) : AsyncNaiResponse<AiModuleDto | ApiError> {
    return await interactWithAPI<AiModuleDto | ApiError>(api_key_novel, 'GET', '/ai/module/' + id);
}
export async function trainModule(api_key_novel: string, prompt: AiModuleTrainRequest) : AsyncNaiResponse<AiModuleDto | ApiError> {
    return await interactWithAPI<AiModuleDto | ApiError>(api_key_novel, 'POST', '/ai/module/train', prompt);
}
export async function bindSubscription(api_key_novel: string, prompt: BindSubscriptionRequest) : AsyncNaiResponse<never | ApiError> {
    return await interactWithAPI<never | ApiError>(api_key_novel, 'POST', '/user/subscription/bind', prompt);
}
export async function changeSubscriptionPlan(api_key_novel: string, prompt: ChangeSubscriptionPlanRequest) : AsyncNaiResponse<never | ApiError> {
    return await interactWithAPI<never | ApiError>(api_key_novel, 'POST', '/user/subscription/change', prompt);
}
export async function changeAccessKey(api_key_novel: string, prompt: ChangeAccessKeyRequest) : AsyncNaiResponse<SuccessfulLoginResponse | ApiError> {
    return await interactWithAPI<SuccessfulLoginResponse | ApiError>(api_key_novel, 'POST', '/user/change-access-key', prompt);
}
export async function createObject(api_key_novel: string, objectType: string, prompt: UserDataInput) : AsyncNaiResponse<Record<string, never> | ApiError> {
    return await interactWithAPI<Record<string, never> | ApiError>(api_key_novel, 'POST', '/user/objects/' + objectType + '/', prompt);
}
export async function deleteObject(api_key_novel: string, objectType: string, id: string) : AsyncNaiResponse<UserData | ApiError> {
    return await interactWithAPI<UserData | ApiError>(api_key_novel, 'DELETE', '/user/objects/' + objectType + '/' + id + '/');
}
export async function editObject(api_key_novel: string, objectType: string, id: string, prompt: UserDataInput) : AsyncNaiResponse<UserData | ApiError> {
    return await interactWithAPI<UserData | ApiError>(api_key_novel, 'PATCH', '/user/objects/' + objectType + '/' + id + '/', prompt);
}
export async function getAccountInformation(api_key_novel: string) : AsyncNaiResponse<AccountInformationResponse | ApiError> {
    return await interactWithAPI<AccountInformationResponse | ApiError>(api_key_novel, 'GET', '/user/information');
}
export async function getClientSettings(api_key_novel: string) : AsyncNaiResponse<never | ApiError> {
    return await interactWithAPI<never | ApiError>(api_key_novel, 'GET', '/user/clientsettings');
}
export async function getCurrentPriority(api_key_novel: string) : AsyncNaiResponse<PriorityResponse | ApiError> {
    return await interactWithAPI<PriorityResponse | ApiError>(api_key_novel, 'GET', '/user/priority');
}
export async function getGiftKeys(api_key_novel: string) : AsyncNaiResponse<GiftKeysResponse | ApiError> {
    return await interactWithAPI<GiftKeysResponse | ApiError>(api_key_novel, 'GET', '/user/giftkeys');
}
export async function getKeystore(api_key_novel: string) : AsyncNaiResponse<GetKeystoreResponse | ApiError> {
    return await interactWithAPI<GetKeystoreResponse | ApiError>(api_key_novel, 'GET', '/user/keystore');
}
export async function getObject(api_key_novel: string, objectType: string, id: string) : AsyncNaiResponse<UserData | ApiError> {
    return await interactWithAPI<UserData | ApiError>(api_key_novel, 'GET', '/user/objects/' + objectType + '/' + id + '/');
}
export async function getObjects(api_key_novel: string, objectType: string) : AsyncNaiResponse<ObjectsResponse | ApiError> {
    return await interactWithAPI<ObjectsResponse | ApiError>(api_key_novel, 'GET', '/user/objects/' + objectType + '/');
}
export async function getSubscription(api_key_novel: string) : AsyncNaiResponse<SubscriptionResponse | ApiError> {
    return await interactWithAPI<SubscriptionResponse | ApiError>(api_key_novel, 'GET', '/user/subscription');
}
export async function getUserData(api_key_novel: string) : AsyncNaiResponse<UserAccountDataResponse | ApiError> {
    return await interactWithAPI<UserAccountDataResponse | ApiError>(api_key_novel, 'GET', '/user/data');
}
export async function getUserSubmission(api_key_novel: string, event: string) : AsyncNaiResponse<never | ApiError> {
    return await interactWithAPI<never | ApiError>(api_key_novel, 'GET', '/user/submission/' + event);
}
export async function getUserSubmissionVotes(api_key_novel: string, event: string) : AsyncNaiResponse<never | ApiError> {
    return await interactWithAPI<never | ApiError>(api_key_novel, 'GET', '/user/vote-submission/' + event + '/');
}
export async function postUserSubmission(api_key_novel: string, prompt: UserSubmissionInput) : AsyncNaiResponse<never | ApiError> {
    return await interactWithAPI<never | ApiError>(api_key_novel, 'GET', '/user/submission/', prompt);
}
export async function retractSubmissionVote(api_key_novel: string, event: string) : AsyncNaiResponse<never | ApiError> {
    return await interactWithAPI<never | ApiError>(api_key_novel, 'DELETE', '/user/vote-submission/' + event + '/');
}
export async function updateClientSettings(api_key_novel: string, prompt: any) : AsyncNaiResponse<never | ApiError> {
    return await interactWithAPI<never | ApiError>(api_key_novel, 'PUT', '/user/clientsettings', prompt);
}
export async function updateKeystore(api_key_novel: string, prompt: UpdateKeystoreRequest) : AsyncNaiResponse<never | ApiError> {
    return await interactWithAPI<never | ApiError>(api_key_novel, 'PUT', '/user/data', prompt);
}
export async function voteSubmission(api_key_novel: string, event: string, prompt: UserSubmissionVoteInput) : AsyncNaiResponse<never | ApiError> {
    return await interactWithAPI<never | ApiError>(api_key_novel, 'POST', '/user/vote-submission/' + event + '/', prompt);
}