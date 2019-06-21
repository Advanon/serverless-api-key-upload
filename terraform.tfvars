terragrunt = {
  terraform {
    source = "git@github.com:Advanon/advanon-infrastructure.git//terraform/modules/cicd/serverless?ref=tags/v0.1.12"
  }
}

project_name = "serverless-api-key-upload"
pr_build_only = "true"
