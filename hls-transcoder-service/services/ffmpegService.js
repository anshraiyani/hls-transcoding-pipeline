const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');

async function transcodeToHLS(inputPath) {
  const baseName = path.basename(inputPath, path.extname(inputPath));
  const outputDir = path.join(__dirname, 'output', baseName);
  fs.mkdirSync(outputDir, { recursive: true });

  const resolutions = [
    { name: '720p', size: '1280x720', bitrate: '3000k' },
    { name: '480p', size: '854x480', bitrate: '1500k' },
    { name: '360p', size: '640x360', bitrate: '800k' },
  ];

  const playlistFiles = [];

  return new Promise((resolve, reject) => {
    
    const processResolution = (resolution) => {
      return new Promise((res, rej) => {
        const outputFile = path.join(outputDir, `${resolution.name}.m3u8`);
        playlistFiles.push(`${resolution.name}.m3u8`);

        ffmpeg(inputPath)
          .videoCodec('libx264')
          .size(resolution.size)
          .outputOptions([
            '-profile:v baseline',
            '-level 3.0',
            '-start_number 0',
            '-hls_time 10',
            '-hls_list_size 0',
            '-f hls',
            `-b:v ${resolution.bitrate}`,
            `-maxrate ${resolution.bitrate}`,
            `-bufsize ${parseInt(resolution.bitrate) * 2}`,
          ])
          .output(outputFile)
          .on('end', res)
          .on('error', rej)
          .run();
      });
    };

    Promise.all(resolutions.map(processResolution))
      .then(() => {
        // Create the master playlist
        const masterPlaylist = path.join(outputDir, 'index.m3u8');
        const masterPlaylistContent = resolutions
          .map(
            (resolution, index) => `#EXT-X-STREAM-INF:BANDWIDTH=${parseInt(resolution.bitrate) * 1000},RESOLUTION=${resolution.size}\n${playlistFiles[index]}`
          )
          .join('\n');

        fs.writeFileSync(masterPlaylist, `#EXTM3U\n${masterPlaylistContent}`);
        resolve(outputDir);
      })
      .catch(reject);
  });
}

module.exports = { transcodeToHLS };