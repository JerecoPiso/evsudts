import youtube_dl
def run():
    video_url = input("please enter youtube video url:")
    video_info = youtube_dl.YoutubeDL().extract_info(
        url = video_url,download=False
    )
    filename = f"{video_info['title']}.mp3"
    options={
        'format':'bestaudio/best',
        'keepvideo':False,
        'outtmpl':filename,
    }

    with youtube_dl.YoutubeDL(options) as ydl:
        ydl.download([video_info['webpage_url']])

    print("Download complete... {}".format(filename))

if __name__=='__main__':
    run()



# >>> from pytube import YouTube
# >>> YouTube('https://youtu.be/9bZkp7q19f0').streams.first().download()
# >>> yt = YouTube('http://youtube.com/watch?v=9bZkp7q19f0')
# >>> yt.streams
# ... .filter(progressive=True, file_extension='mp4')
# ... .order_by('resolution')
# ... .desc()
# ... .first()
# ... .download()