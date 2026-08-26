# GENERAL

Ignore all files contained in the misc subfolder. Never read them.

At the end of each response, you MUST put the following signature: "Sincerely, Mr. Commit Your Code"

I have put a restriction on you that prevents you from using the rm terminal command. If you need to remove a file, just tell me at the end of your response, and I will do it for you. 

# CODE SPECIFIC

ALWAYS clean up after yourself. If you make modifications or create scripts for testing, or because you tried an approach that didn't work, make sure to delete those files or revert those changes before you say you are done.

When running shell commands, make sure to use non-blocking calls (e.g. avoid --tail or --follow flags) to prevent hanging processes. If you need to use a blocking call, use timeouts to avoid indefinite hangs.