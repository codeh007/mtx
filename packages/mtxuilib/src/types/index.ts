import type { Ai } from "@cloudflare/ai";
import type { z } from "zod";
import type { User } from "../db/schema";
import type { Icons } from "../icons";
export type { WorkflowEvent, WorkflowStep } from "cloudflare:workers";
// export * from "./opencanvasTypes";
export type ZodObjectAny = z.ZodObject<any, any, any, any>;

export interface Env {
  // Add your bindings here, e.g. Workers KV, D1, Workers AI, etc.
  MY_WORKFLOW: Workflow;
  // Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
  // MY_KV_NAMESPACE: KVNamespace;
  //
  // Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
  // MY_DURABLE_OBJECT: DurableObjectNamespace;
  //
  // Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
  // MY_BUCKET: R2Bucket;
  AI: Ai;
}

// declare global {
declare namespace NodeJS {
  export interface ProcessEnv {
    PORT: string;
    MTX_CACHE_DISABLED: string;
    MTX_CACHE_DEFAULT_SECONDS: string;
    GITHUB_APP_TOKEN: string;
    GITHUB_APP_ID: string;
    GITHUB_APP_PRIVATE_KEY: string;
    GITHUB_ID: string; //GITHUB_APP_CLIENT_ID
    GITHUB_SECRET: string;
    GITHUB_CLIENT_SECRET: string;
    GITHUB_CLIENT_ID: string;
    MTXP2P_BACKEND_URL: string;
    MT_APP_ID: string;
    MTM_SITE_ID: string;
    NEXTAUTH_URL: string;
    NEXTAUTH_SECRET: string;
    FACEBOOK_ID: string;
    FACEBOOK_SECRET: string;
    TWITTER_ID: string;
    TWITTER_SECRET: string;
    GOOGLE_APP_ID: string;
    GOOGLE_APP_SECRET: string;
    AUTH0_ID: string;
    // AUTH0_SECRET: string;
    NEXT_PUBLIC_SANITY_DATASET: string;
    NEXT_PUBLIC_SANITY_PROJECT_ID: string;
    // NEXT_PUBLIC_GRAPHQL_ENDPOINT: string;
    VOLUMES_DIR: string;
    //基于go的微服务后端网址(对于动态类型数据调用， 还应该直接使用http api的方式调用比较合适，原生的grpc，太复杂了。)
    // MSERVICE_URL: string;
    NEXT_PUBLIC_MTMAPI_URL: string;
    NEXT_PUBLIC_MTMAPI_GRPC_URL: string;
    MTMAPI_URL: string;
    MTMAPI_SITE_TOKEN: string;
    //重型UI网址
    NEXT_PUBLIC_XUI_URL: string;
    //chatgpt 相关
    OPENAI_API_KEY?: string;
    CODE?: string;
    BASE_URL?: string;
    PROXY_URL?: string;
    VERCEL?: "1";
    HIDE_USER_API_KEY?: string; // disable user's api key input
    DISABLE_GPT4?: string; // allow user to use gpt-4 or not
    BUILD_MODE?: "standalone" | "export";
    BUILD_APP?: string; // is building desktop app
    HIDE_BALANCE_QUERY?: string; // allow user to query balance or not
    KV100: KVNamespace;
    MTM_HOSTNAME?: string;
    MTM_BACKEND: string;

    CLOUDFLARE_ACCOUNT_ID?: string;
    CLOUDFLARE_API_EMAIL: string;
    CLOUDFLARE_API_TOKEN: string;
  }
}

// import { User } from "@prisma/client"

export type Await<T> = T extends PromiseLike<infer U> ? U : T;
export type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;
declare function MaybePromise<T>(value: T): T | Promise<T> | PromiseLike<T>;

export type NavItem = {
  title: string;
  href: string;
  disabled?: boolean;
};

export type MainNavItem = NavItem;

export type SidebarNavItem = {
  title: string;
  disabled?: boolean;
  external?: boolean;
  icon?: keyof typeof Icons;
} & (
  | {
      href: string;
      items?: never;
    }
  | {
      href?: string;
      //@ts-ignore
      items: NavLink[];
    }
);

export type SiteConfig = {
  name: string;
  links: {
    twitter: string;
    github: string;
  };
};

export type DocsConfig = {
  mainNav: MainNavItem[];
  sidebarNav: SidebarNavItem[];
};

export type MarketingConfig = {
  mainNav: MainNavItem[];
};

export type DashboardConfig = {
  mainNav: MainNavItem[];
  sidebarNav: SidebarNavItem[];
};

export type SettingsConfig = {
  sidebarNav: SidebarNavItem[];
};

export type SubscriptionPlan = {
  name: string;
  description: string;
  stripePriceId: string;
};

export type UserSubscriptionPlan = SubscriptionPlan &
  //@ts-ignore
  Pick<User, "stripeCustomerId" | "stripeSubscriptionId"> & {
    stripeCurrentPeriodEnd: number;
    isPro: boolean;
  };

export interface GithubRepository {
  id: number;
  node_id: string;
  name: string;
  full_name: string;
  private: boolean;
  owner: Owner;
  html_url: string;
  description?: null;
  fork: boolean;
  url: string;
  forks_url: string;
  keys_url: string;
  collaborators_url: string;
  teams_url: string;
  hooks_url: string;
  issue_events_url: string;
  events_url: string;
  assignees_url: string;
  branches_url: string;
  tags_url: string;
  blobs_url: string;
  git_tags_url: string;
  git_refs_url: string;
  trees_url: string;
  statuses_url: string;
  languages_url: string;
  stargazers_url: string;
  contributors_url: string;
  subscribers_url: string;
  subscription_url: string;
  commits_url: string;
  git_commits_url: string;
  comments_url: string;
  issue_comment_url: string;
  contents_url: string;
  compare_url: string;
  merges_url: string;
  archive_url: string;
  downloads_url: string;
  issues_url: string;
  pulls_url: string;
  milestones_url: string;
  notifications_url: string;
  labels_url: string;
  releases_url: string;
  deployments_url: string;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  git_url: string;
  ssh_url: string;
  clone_url: string;
  svn_url: string;
  homepage?: null;
  size: number;
  stargazers_count: number;
  watchers_count: number;
  language: string;
  has_issues: boolean;
  has_projects: boolean;
  has_downloads: boolean;
  has_wiki: boolean;
  has_pages: boolean;
  has_discussions: boolean;
  forks_count: number;
  mirror_url?: null;
  archived: boolean;
  disabled: boolean;
  open_issues_count: number;
  license?: null;
  allow_forking: boolean;
  is_template: boolean;
  web_commit_signoff_required: boolean;
  topics?: null[] | null;
  visibility: string;
  forks: number;
  open_issues: number;
  watchers: number;
  default_branch: string;
  permissions: Permissions;
}
export interface Owner {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
}
export interface Permissions {
  admin: boolean;
  maintain: boolean;
  push: boolean;
  triage: boolean;
  pull: boolean;
}

export interface GithubUser {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
  name: string;
  company: any;
  blog: string;
  location: any;
  email: string;
  hireable: boolean;
  bio: any;
  twitter_username: string;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
  private_gists: number;
  total_private_repos: number;
  owned_private_repos: number;
  disk_usage: number;
  collaborators: number;
  two_factor_authentication: boolean;
  plan: Plan;
}

export interface Plan {
  name: string;
  space: number;
  collaborators: number;
  private_repos: number;
}

export interface GithubIssue {
  url: string;
  repository_url: string;
  labels_url: string;
  comments_url: string;
  events_url: string;
  html_url: string;
  id: number;
  node_id: string;
  number: number;
  title: string;
  user: GithubUser;
  labels: any[];
  state: string;
  locked: boolean;
  assignee: any;
  assignees: any[];
  milestone: any;
  comments: number;
  created_at: string;
  updated_at: string;
  closed_at: any;
  author_association: string;
  active_lock_reason: any;
  body: string;
  reactions: Reactions;
  timeline_url: string;
  performed_via_github_app: any;
  state_reason: any;
}

export interface GithubUser {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
}

export interface Reactions {
  url: string;
  total_count: number;
  "+1": number;
  "-1": number;
  laugh: number;
  hooray: number;
  confused: number;
  heart: number;
  rocket: number;
  eyes: number;
}

export interface GithubIssueSearch {
  total_count: number;
  incomplete_results: boolean;
  items: GithubIssue[];
}

export interface GithubOrg {
  login: string;
  id: number;
  node_id: string;
  url: string;
  repos_url: string;
  events_url: string;
  hooks_url: string;
  issues_url: string;
  members_url: string;
  public_members_url: string;
  avatar_url: string;
  description: string;
}
