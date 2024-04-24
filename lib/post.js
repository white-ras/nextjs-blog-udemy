import path from 'path';
import fs from 'fs';
import matter from 'gray-matter';

import { remark } from 'remark';
import html from 'remark-html';

const postsDirectory = path.join(process.cwd(), 'posts');

// mdfileのデータを取り出す
export function getPostsData() {
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    const id = fileName.replace(/\.md$/, ''); // file name(id)

    // mdfile read as strings
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    const matterResult = matter(fileContents);

    //return id , data
    return {
      id,
      ...matterResult.data,
    };
  });
  return allPostsData;
}

//動的ルーティング時に設定
//postsディレクトリの中の全てのファイル名をリストで返す
export function getAllPostIds() {
  const fileNames = fs.readdirSync(postsDirectory);
  // 以下のような配列を返します:
  // [
  //   {
  //     params: {
  //       id: 'ssg-ssr'
  //     }
  //   },
  //   {
  //     params: {
  //       id: 'pre-rendering'
  //     }
  //   }
  // ]
  return fileNames.map((fileName) => {
    return {
      //あとで、これら(id)がルーティングのパスになる。
      params: {
        id: fileName.replace(/\.md$/, ''),
      },
    };
  });
}
// id に基づいてブログ投稿データを返す
export async function getPostData(id) {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContent = fs.readFileSync(fullPath, 'utf8');

  const matterResult = matter(fileContent); // まだ文字列

  const blogContent = await remark().use(html).process(matterResult.content);

  const blogContentHTML = blogContent.toString();

  return {
    id,
    blogContentHTML,
    ...matterResult.data,
  };
}
