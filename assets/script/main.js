// render html
// handle event play/pause
// cd rotate
// handle progress bar
// settings repeat/random
// element scroll into view
// choose song in playlist

const songs = [
    {
        name: 'ĐỌC ĐÚNG SÁCH YÊU ĐÚNG CÁCH SINKRA REMIX',
        author: 'ANH RỒNG',
        path: "./assets/song_lists/doc-dung.mp3",
        img: "./assets/picture/doc-dung.jpg",
    },
    {
        name: 'Anh Không Là Tất Cả',
        author: 'Orinn Remix',
        path: "./assets/song_lists/anh-ko.mp3",
        img: "./assets/picture/anh-ko.jpg",
    },
    {
        name: 'Có Duyên Không Nợ Orinn Remix',
        author: 'NB3 Hoài Bảo',
        path: "./assets/song_lists/co-duyen.mp3",
        img: "./assets/picture/co-duyen.jpg",
    },
    {
        name: 'Tấm Thân Dãi Dầu Remix',
        author: 'Phát Huy T4 x DJ Đại Mèo',
        path: "./assets/song_lists/hoi-the-gian.mp3",
        img: "./assets/picture/hoi-the-gian.jpg",
    },
    {
        name: 'Mây Đêm Chờ Mấy Đêm',
        author: 'Nguyễn Hữu Kha x AnhVuRemix',
        path: "./assets/song_lists/may-dem.mp3",
        img: "./assets/picture/may-dem.jpg",
    },
    {
        name: "MÌNH LẠC NHAU MUÔN ĐỜI",
        author: 'Phạm Sắc Lệnh MUS Remix',
        path: './assets/song_lists/minh-lac.mp3',
        img: './assets/picture/minh-lac.jpg',
    },
    {
        name: 'Người Tình Si',
        author: 'NQP x DuyNH Prod',
        path: './assets/song_lists/nguoi-tinh.mp3',
        img: './assets/picture/nguoi-tinh.jpg',
    },
    {
        name: 'Chợt Buồn',
        author: 'LONG HẢI x ĐẠI MÈO REMIX',
        path: './assets/song_lists/nhin-hat-mua.mp3',
        img: './assets/picture/nhin-hat-mua.jpg',
    },
    {
        name: 'Thay Lòng REMIX',
        author: 'Nal x TVK',
        path: './assets/song_lists/thay-long.mp3',
        img: './assets/picture/thay-long.jpg',
    },
    {
        name: 'Vậy Là Ta Mất Nhau',
        author: 'Orinn Remix x Khải Đăng',
        path: './assets/song_lists/vay-la.mp3',
        img: './assets/picture/vay-la.jpg',
    },
];

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const cd = $('.cd');
const playBtn = $('.btn.playbtn');
const heading = $('#header h3');
const cd_thumb = $('.cd .thumbnail');
const audio = $('audio');
const progressBar = $('.progress')
const nextBtn = $('.btn.nextbtn')
const preBtn = $('.btn.prebtn')
const reBtn = $('.repeatbtn')
const randomBtn = $('.btn.randombtn')
const playlist = $('.playlist')

const PLAYER_STORAGE_KEY = "Đăng_Vip_Pro"
const app = {
    currentIndex: 0,
    isPlaying: false,
    isRepeat: false,
    isRandom: false,
    playlistRandom: [],
    songs,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    setConfig: function(key,value) {
        this.config[key] = value
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
            <li class="song ${index == this.currentIndex? 'active': ''}" data-index="${index}">
                <div class="img" style="background-image: url(${song.img})"></div>
                <div>
                    <h4 class="title">${song.name}</h4>
                    <h6 class="author">${song.author}</h6>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </li>
            `
        });
        
        $(".songs").innerHTML = htmls.join("\n");
    },
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong',{
            get: function() {
                return this.songs[this.currentIndex]
            }
        });
    },
    loadConfig: function() {
        this.isRepeat
        this.isRandom
        reBtn.classList.toggle('active', this.isRepeat)
        randomBtn.classList.toggle('active', this.isRandom)
    },
    loadsong: function() {
        heading.innerText = this.currentSong.name
        cd_thumb.style.backgroundImage = `url(${this.currentSong.img})`
        audio.src = this.currentSong.path
    },
    nextSong: function() {
        this.currentIndex++
        if (this.currentIndex>=this.songs.length) {
            this.currentIndex = 0
        }
        this.loadsong()
    },
    preSong: function() {
        this.currentIndex--
        if (this.currentIndex<0) {
            this.currentIndex = this.songs.length-1
        }
        this.loadsong()
    },
    randomSong: function() {
        var newIndex;
        if (this.playlistRandom.length == 0 || this.playlistRandom.length == this.songs.length) {
            this.playlistRandom = [this.currentIndex]
        }
        do {
            newIndex = Math.floor(Math.random()*this.songs.length)
        } while (this.playlistRandom.includes(newIndex))
        if (!this.playlistRandom.includes(newIndex)) {
            this.playlistRandom.push(newIndex)
        }
        this.currentIndex = newIndex
        this.loadsong()
    },
    scrolltoActiveSong: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'end'
            })}, 300)
        // setTimeout(() => {$('.song.active').scrollIntoView({
        //     behavior: 'smooth',
        //     block: 'center'
        // })}, 200)
    },
    handleEvent: function() {
        const _this = this;
        const cdWidth = cd.offsetWidth;
        var cdRotate = cd_thumb.animate([ {transform: 'rotate(360deg)'} ], {
            duration: 30000,
            iterations: Infinity
        });
        
        cdRotate.pause()

        document.onscroll = () => {
            var scrollY = window.scrollY || document.documentElement.scrollTop;
            var newWidth = cdWidth - scrollY;

            cd.style.width = newWidth>0? newWidth + 'px': 0;
            cd.style.opacity = newWidth/cdWidth;
        }

        playBtn.onclick = () => {
            if (!_this.isPlaying) {
                audio.play()
            } 
            else {
                audio.pause()
            }
        }

        progressBar.onchange = () => {
            audio.currentTime = (progressBar.value/100*audio.duration)
        }

        audio.onplay = () => {
            cdRotate.play() 
            _this.isPlaying = true;
            $('.player').classList.add('playing')
        }
        
        audio.onpause = () => {
            cdRotate.pause()    
            _this.isPlaying = false;
            $('.player').classList.remove('playing')
        }

        nextBtn.onclick = () => {
            if (_this.isRandom) {
                _this.randomSong()
            }
            _this.nextSong()
            audio.play()
            _this.render()
            _this.scrolltoActiveSong()
        }
        
        preBtn.onclick = () => {
            if (_this.isRandom) {
                this.randomSong()
            }
            _this.preSong()
            audio.play()
            _this.render()
            _this.scrolltoActiveSong()
        }

        reBtn.onclick = () => {
            _this.isRepeat = !_this.isRepeat
            reBtn.classList.toggle('active', _this.isRepeat)
            this.setConfig('isRepeat', _this.isRepeat)
        }

        randomBtn.onclick = () => {
            _this.isRandom = !_this.isRandom
            randomBtn.classList.toggle('active', _this.isRandom)
            this.setConfig('isRandom', _this.isRandom)
        }

        audio.ontimeupdate = () => {
            if (audio.duration) {
                progressBar.value = Math.floor(audio.currentTime/audio.duration*100)
            }
        }

        audio.onended = () => {
            if (!_this.isRepeat) {nextBtn.click()}
            audio.play()
        }

        playlist.onclick = (e) => {
            if (e.target.closest('.song:not(.active)') || e.target.closest('.option')) {
                if (e.target.closest('.option')) {
                    console.log('this is option')
                } else  {
                    _this.currentIndex = e.target.closest('.song').dataset.index
                    _this.loadsong()
                    _this.render()
                    _this.scrolltoActiveSong()
                    audio.play()
                }
            }
        }
    },
    start: function() {
        this.loadConfig()
        this.defineProperties()
        this.loadsong()
        this.handleEvent()
        this.render()
    }

}

app.start()
