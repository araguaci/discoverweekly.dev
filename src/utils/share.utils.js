import {isMobile as detectMobile} from '@deckdeckgo/utils';

import config from '../config.json';

import {playlistUrl, weeklyPlaylistsUrl} from './playlist.utils';
import {formatDate} from './date.utils';

export const openShareDiscoverWeekly = async () => {
  if (isMobile()) {
    await shareMobile({
      text: config.description,
      url: config.url,
    });
  } else {
    await shareSocialDesktop(config.url, `Checkout ${config.title} by ${config.twitterUsername} 🤟`, `Checkout ${config.title} ${config.url}`);
  }
};

export const openSharePlaylist = async (slug, name, twitter) => {
  const url = playlistUrl(slug);

  if (isMobile()) {
    await shareMobile({
      text: `${name} playlist on ${config.title}`,
      url,
    });
  } else {
    await shareSocialDesktop(url, `Checkout ${twitter ? '@' + twitter : name} playlist on ${config.twitterUsername} 🤟`, `Checkout ${name} playlist ${url}`);
  }
};

export const openShareWeeklyPlaylists = async (slug, weekly) => {
  const url = weeklyPlaylistsUrl(slug);
  const date = formatDate(weekly);

  if (isMobile()) {
    await shareMobile({
      text: `Playlists published on ${config.title} (${date})`,
      url,
    });
  } else {
    await shareSocialDesktop(url, `Checkout these playlists on ${config.twitterUsername} 🤟`, `Checkout these playlists ${url}`);
  }
};

const isMobile = () => navigator && navigator.share && detectMobile();

const shareSocialDesktop = async (url, twitterText, emailText) => {
  const shareOptions = {
    displayNames: true,
    config: [
      {
        twitter: {
          socialShareText: twitterText,
          socialShareUrl: url,
          socialSharePopupWidth: 300,
          socialSharePopupHeight: 400,
        },
      },
      {
        linkedin: {
          socialShareUrl: url,
        },
      },
      {
        email: {
          socialShareBody: emailText,
        },
      },
      {
        whatsapp: {
          socialShareUrl: url,
        },
      },
      {
        copy: {
          socialShareUrl: url,
        },
      },
      {
        hackernews: {
          socialShareUrl: url,
        },
      },
    ],
  };

  await shareDesktop(shareOptions);
};

const shareMobile = async (data) => {
  try {
    await navigator.share(data);
  } catch (err) {
    // Do not display error such as aborted by the user
  }
};

const shareDesktop = async (shareOptions) => {
  const webSocialShare = document.querySelector('web-social-share');

  if (!webSocialShare) {
    return;
  }

  webSocialShare.share = shareOptions;
  webSocialShare.show = true;
};
