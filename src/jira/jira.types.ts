// https://developer.atlassian.com/server/jira/platform/rest-apis/

// Return of this url:
// http://jira.mydomain.com/rest/api/latest/issue/MX-45400
export interface JiraIssue {
  fields: {
    status: {
      id: string;
      iconUrl: string;
      name: string;
    },
    summary: string;
    description: string;
    subtasks: JiraIssueSubtask[],
    assignee?: JiraIssueAssignee,
  },
}

export interface JiraIssueSubtask {
  id: string;
  key: string;
  self: string;
  fields: {
    summary: string;
    status: {
      id: string;
      iconUrl: string;
      name: string;
    }
  }
}

export interface JiraIssueAssignee {
  active: boolean;
  displayName: string;
  emailAddress: string;
}
