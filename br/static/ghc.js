function tryLoadGithubComment() {
    const ghcCommentId = document.querySelector('h1').getAttribute('data-ghc-id');
    if (!ghcCommentId) {
        return // no comments assumed on current page
    }
    const ghcUser = 'zencd' // todo hardcode
    const ghcRepo = 'pages-zen'
    const addCommentUrl = `https://github.com/${ghcUser}/${ghcRepo}/issues/${ghcCommentId}`;
    const ghcApiUrl = `https://api.github.com/repos/${ghcUser}/${ghcRepo}/issues/${ghcCommentId}/comments`;
    fetch(ghcApiUrl, {
        headers: {Accept: "application/vnd.github.v3.html+json"}
    }).then((response) => {
        return response.json()
    }).then((comments) => {
        comments.forEach((comment) => {
            let text = "<a href='" + comment.user.html_url + "' target='_blank'>" + comment.user.login + "</a>: " + comment.body_html;
            const $ghcListItem = document.createElement('div')
            $ghcListItem.setAttribute('class', 'ghcListItem');
            $ghcListItem.innerHTML = text;
            document.querySelector('#ghcList').appendChild($ghcListItem);
        })
    }).catch((error) => {
        console.log(error)
    });
}
