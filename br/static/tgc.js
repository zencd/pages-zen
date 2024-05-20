function tryLoadTelegramComments() {
  const $tgComments = document.getElementById('tgComments')
  if ($tgComments) {
    $tgComments.innerHTML = '' // cleanup previous comments
  }
  const channelName = document.querySelector('h1').getAttribute('data-tgc-channel');
  const postId = document.querySelector('h1').getAttribute('data-tgc-post');
  if (!postId || !channelName || !$tgComments) {
    return // no comments assumed on current page
  }
  loadTelegramComments(channelName, postId, $tgComments)
}

function loadTelegramComments(tgChannelName, tgPostId, $parent) {
  var $script = document.createElement('script')
  $script.setAttribute('async', '')
  $script.setAttribute('src', 'https://telegram.org/js/telegram-widget.js?22')
  $script.setAttribute('data-telegram-discussion', tgChannelName + '/' + tgPostId)
  $script.setAttribute('data-comments-limit', '5')
  $script.setAttribute('data-dark', '1')
  $parent.appendChild($script)
}
