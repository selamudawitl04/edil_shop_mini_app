export default defineNuxtPlugin((nuxtApp) => {
  const imageExtensions = [
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
    ".gif",
    ".bmp",
    ".tiff",
    ".svg",
  ];
  const videoExtensions = [
    ".mp4",
    ".avi",
    ".mov",
    ".wmv",
    ".mkv",
    ".flv",
    ".webm",
    ".mpeg",
    ".mpg",
  ];
  const audioExtensions = [
    ".mp3",
    ".wav",
    ".ogg",
    ".m4a",
    ".flac",
    ".aac",
    ".wma",
  ];
  const pdfExtensions = [".pdf"];

  const knownImageHosts = [
    "i.pravatar.cc",
    "via.placeholder.com",
    "unsplash.com",
  ];
  const knownVideoHosts = ["youtube.com", "vimeo.com", "streamable.com"];
  const knownAudioHosts = ["soundcloud.com", "audiomack.com"];
  const knownPdfHosts = []; // Add any if needed

  const matchesExtension = (url, extensions) =>
    extensions.some((ext) => url.toLowerCase().includes(ext));

  const matchesHost = (url, hosts) =>
    hosts.some((host) => url.toLowerCase().includes(host));

  const isImageUrl = (url) => {
    if (!url) return false;
    return (
      matchesExtension(url, imageExtensions) ||
      matchesHost(url, knownImageHosts)
    );
  };

  const isVideoUrl = (url) => {
    if (!url) return false;
    return (
      matchesExtension(url, videoExtensions) ||
      matchesHost(url, knownVideoHosts)
    );
  };

  const isAudioUrl = (url) => {
    if (!url) return false;
    return (
      matchesExtension(url, audioExtensions) ||
      matchesHost(url, knownAudioHosts)
    );
  };

  const isPdfUrl = (url) => {
    if (!url) return false;
    return (
      matchesExtension(url, pdfExtensions) || matchesHost(url, knownPdfHosts)
    );
  };

  nuxtApp.provide("mediaUtils", {
    isImageUrl,
    isVideoUrl,
    isAudioUrl,
    isPdfUrl,
  });
});
