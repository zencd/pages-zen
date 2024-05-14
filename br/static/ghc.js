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
        //console.log('comments', comments)
        comments.forEach((comment) => {
            //console.log('comment', comment)
            let t = "<a href='" + comment.user.html_url + "'>" + comment.user.login + "</a>:";
            t += comment.body_html;
            const $ghcListItem = document.createElement('div')
            $ghcListItem.setAttribute('class', 'ghcListItem');
            $ghcListItem.innerHTML = t;
            document.querySelector('#ghcList').appendChild($ghcListItem);
        })
    }).catch((error) => {
        console.log(error)
    });
}
