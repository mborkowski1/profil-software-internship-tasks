const fetch = require('node-fetch');

let data = {count: 0, posts: []};

beforeAll(() => {
    return new Promise((resolve, reject) => {
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
                resolve();
            })
            .catch(error => {
                reject(error);
            });
    });
});

describe('get data from api', () => {
    test('count and quantity of posts should be 26', () => {
        expect(data.count).toBe(26);
    });

    test('quantity of posts should be 26', () => {
        expect(data.posts.length).toBe(26);
    });
});

describe('sort data', () => {
    test('sort posts by upvotes asc', () => {
        let posts = sortData('upVotes', 'asc');
        expect(posts[0].upvotes).toBeLessThanOrEqual(posts[1].upvotes);
    });

    test('sort posts by upvotes desc', () => {
        let posts = sortData('upVotes', 'desc');
        expect(posts[0].upvotes).toBeGreaterThanOrEqual(posts[1].upvotes);
    });

    test('sort posts by score asc', () => {
        let posts = sortData('score', 'asc');
        expect(posts[0].score).toBeLessThanOrEqual(posts[1].score);
    });

    test('sort posts by score desc', () => {
        let posts = sortData('score', 'desc');
        expect(posts[0].score).toBeGreaterThanOrEqual(posts[1].score);
    });

    test('sort posts by comments asc', () => {
        let posts = sortData('comments', 'asc');
        expect(posts[0].num_comments).toBeLessThanOrEqual(posts[1].num_comments);
    });

    test('sort posts by comments desc', () => {
        let posts = sortData('comments', 'desc');
        expect(posts[0].num_comments).toBeGreaterThanOrEqual(posts[1].num_comments);
    });

    test('sort posts by created asc', () => {
        let posts = sortData('created', 'asc');
        let post1DateTimestamp = getDateTimestamp(posts[0].created);
        let post2DateTimestamp = getDateTimestamp(posts[1].created);
        expect(post1DateTimestamp).toBeLessThanOrEqual(post2DateTimestamp);
    });

    test('sort posts by created desc', () => {
        let posts = sortData('created', 'desc');
        let post1DateTimestamp = getDateTimestamp(posts[0].created);
        let post2DateTimestamp = getDateTimestamp(posts[1].created);
        expect(post1DateTimestamp).toBeGreaterThanOrEqual(post2DateTimestamp);
    });
});

function sortData(name, sortType) {
    let posts = [];

    for (let post of data.posts.values()) {
        posts.push(post);
    }

    if (sortType === 'asc') {
        switch (name) {
            case 'upVotes':
                posts.sort((a, b) => {
                    return a.upvotes - b.upvotes
                });
                break;
            case 'score':
                posts.sort((a, b) => {
                    return a.score - b.score
                });
                break;
            case 'comments':
                posts.sort((a, b) => {
                    return a.num_comments - b.num_comments
                });
                break;
            case 'created':
                posts.sort((a, b) => {
                    let date1 = getDateTimestamp(a.created);
                    let date2 = getDateTimestamp(b.created);
                    return date1 - date2;
                });
                break;
        }
    }
    else if (sortType === 'desc') {
        switch (name) {
            case 'upVotes':
                posts.sort((a, b) => {
                    return b.upvotes - a.upvotes
                });
                break;
            case 'score':
                posts.sort((a, b) => {
                    return b.score - a.score
                });
                break;
            case 'comments':
                posts.sort((a, b) => {
                    return b.num_comments - a.num_comments
                });
                break;
            case 'created':
                posts.sort((a, b) => {
                    let date1 = getDateTimestamp(a.created);
                    let date2 = getDateTimestamp(b.created);
                    return date2 - date1;
                });
                break;
        }
    }

    return posts;
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
