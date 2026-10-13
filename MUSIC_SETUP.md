# COSMOS soundtrack — updated

The soundtrack is derived from the `COSMOS.mp3` file supplied by the project owner.

## Playback behavior

- **Enabled by default** for new visitors; attempts autoplay, then starts on the first permitted click, tap or key interaction if blocked by the browser. Users can turn it off in the header or Sound Studio, and the preference is saved in local storage.
- Starts at a low volume and fades in gently over approximately 1.4 seconds.
- Fades out over approximately 0.65 seconds when disabled; resets to the beginning.
- Sound Studio allows the user to adjust the music volume.
- Pauses while the browser tab is hidden, and resumes (with a fade) when the active tab returns if the user previously enabled it.
- No additional bell or synthetic arrival effects interrupt the music.

## Loop preparation

The original track is about 180 seconds long, with a substantial fade to silence near its end. The bundled `public/assets/audio/cosmos-ambient.mp3` is a 150-second loop prepared from the source. It crossfades the closing 10 seconds of the selected section into the opening 10 seconds to avoid an obvious silent gap. The original source file has not been changed.

## File locations

- Editable React edition: `public/assets/audio/cosmos-ambient.mp3`
- Standalone offline edition: `COSMOS_OFFLINE.html` (soundtrack embedded in the file)

If you replace the music later, regenerate the self-contained HTML to update its embedded audio. Merely replacing the MP3 in the React project does not update the offline HTML.

## Rights and credits

The music was supplied by the project owner. Confirm the appropriate license or usage rights for public distribution, including whether it may be embedded in a downloadable website project. This update does not establish any rights over third-party music.
