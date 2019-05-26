function getData() {
    fetch("https://www.reddit.com/r/funny.json")
        .then(response => response.json())
        .then(result => {
            let count = 0;
            result.data.children.forEach(post => {
                let date = new Date(post.data.created * 1000);
                let formattedDate = ('0' + date.getDate()).slice(-2)
                    + '.' + ('0' + (date.getMonth() + 1)).slice(-2)
                    + '.' + date.getFullYear()
                    + " " + ('0' + date.getHours()).slice(-2)
                    + ":" + ('0' + date.getMinutes()).slice(-2);
                let newPost = {
                    title: post.data.title,
                    upvotes: post.data.ups,
                    score: post.data.score,
                    num_comments: post.data.num_comments,
                    created: formattedDate
                };
                data.posts.push(newPost);
                count++;
            });
            data.count = count;
            showData(data.posts);
            addEventListeners();
        })
        .catch(error => {
            throw error
        });
}

function showData(posts) {
    const tbody = document.getElementsByTagName('tbody')[0];
    tbody.innerHTML = '';
    let counter = 1;
    for (let post of posts.values()) {
        const counterTd = document.createElement("td");
        const tr = document.createElement("tr");
        counterTd.innerHTML = counter + ".";
        tr.appendChild(counterTd);
        Object.values(post).map(value => {
            const td = document.createElement("td");
            td.innerHTML = value;
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
        counter++;
    }
}

function sortData(name) {
    if (sortType === 'asc') {
        if (sortBy !== name)
            sortBy = name;
        sortType = 'desc';
    }
    else {
        if (sortBy !== name)
            sortBy = name;
        sortType = 'asc';
    }

    if (sortType === 'asc') {
        switch (name) {
            case 'upVotes':
                data.posts.sort((a, b) => {
                    return a.upvotes - b.upvotes
                });
                break;
            case 'score':
                data.posts.sort((a, b) => {
                    return a.score - b.score
                });
                break;
            case 'comments':
                data.posts.sort((a, b) => {
                    return a.num_comments - b.num_comments
                });
                break;
            case 'created':
                data.posts.sort((a, b) => {
                    let date1 = getDateTimestamp(a.created);
                    let date2 = getDateTimestamp(b.created);
                    return date1 - date2;
                });
                break;
        }
    }
    else {
        switch (name) {
            case 'upVotes':
                data.posts.sort((a, b) => {
                    return b.upvotes - a.upvotes
                });
                break;
            case 'score':
                data.posts.sort((a, b) => {
                    return b.score - a.score
                });
                break;
            case 'comments':
                data.posts.sort((a, b) => {
                    return b.num_comments - a.num_comments
                });
                break;
            case 'created':
                data.posts.sort((a, b) => {
                    let date1 = getDateTimestamp(a.created);
                    let date2 = getDateTimestamp(b.created);
                    return date2 - date1;
                });
                break;
        }
    }

    showData(data.posts);
}

function getDateTimestamp(dateString) {
    let splittedString = dateString.split(" ");
    let splittedDayMonthYear = splittedString[0].split(".");
    let splittedHoursMinutes = splittedString[1].split(":");
    let day = splittedDayMonthYear[0];
    let month = splittedDayMonthYear[1];
    let year = splittedDayMonthYear[2];
    let hours = splittedHoursMinutes[0];
    let minutes = splittedHoursMinutes[1];
    return Date.parse(new Date(Number(year), Number(month - 1), Number(day), Number(hours), Number(minutes)).toString());
}

function getPostWithBestRateTitle() {
    let bestRate = 0;
    let youngestPostDateTimestamp = 0;
    let postsWithBestRate = [];
    let postWithBestRateTitle = '';

    for (let post of data.posts.values()) {
        let upvotes = post['upvotes'];
        let num_comments = post['num_comments'];
        let postRate = upvotes/num_comments;
        if (postRate >= bestRate)
            bestRate = postRate;
    }

    for (let post of data.posts.values()) {
        let upvotes = post['upvotes'];
        let num_comments = post['num_comments'];
        let postRate = upvotes/num_comments;
        if (postRate === bestRate)
            postsWithBestRate.push(post);
    }

    for (let post of postsWithBestRate.values()) {
        let postDateTimestamp = getDateTimestamp(post['created']);
        if (postDateTimestamp > youngestPostDateTimestamp) {
            youngestPostDateTimestamp = postDateTimestamp;
            postWithBestRateTitle = post['title'];
        }
    }

    const bestPostTitle = document.getElementById("bestPostTitle");
    bestPostTitle.innerHTML = postWithBestRateTitle;
}

function searchRecentPosts() {
    let posts = [];
    let recent24h = Date.now() - (24 * 60 * 60 * 1000);

    for (let post of data.posts.values()) {
        let postDateTimestamp = getDateTimestamp(post['created']);

        if (postDateTimestamp >= recent24h && postDateTimestamp <= Date.now()) {
            posts.push(post);
        }
    }

    showData(posts);
}

function addEventListeners() {
    const upVotes = document.getElementById('upVotes');
    upVotes.addEventListener('click', () => {
        sortData('upVotes')
    });

    const score = document.getElementById('score');
    score.addEventListener('click', () => {
        sortData('score')
    });

    const comments = document.getElementById('comments');
    comments.addEventListener('click', () => {
        sortData('comments')
    });

    const created = document.getElementById('created');
    created.addEventListener('click', () => {
        sortData('created')
    });

    const upVotesButton = document.getElementById('upVotesButton');
    upVotesButton.addEventListener('click', () => {
        sortData('upVotes')
    });

    const scoreButton = document.getElementById('scoreButton');
    scoreButton.addEventListener('click', () => {
        sortData('score')
    });

    const commentsButton = document.getElementById('commentsButton');
    commentsButton.addEventListener('click', () => {
        sortData('comments')
    });

    let createdButton = document.getElementById('createdButton');
    createdButton.addEventListener('click', () => {
        sortData('created')
    });

    let recentPostsButton = document.getElementById('recentPostsButton');
    recentPostsButton.addEventListener('click', searchRecentPosts);

    let bestPostTitleButton = document.getElementById("bestPostTitleButton");
    bestPostTitleButton.addEventListener("click", getPostWithBestRateTitle);
}

const data = {count: 0, posts: []};
let sortBy = '';
let sortType = '';

getData();
