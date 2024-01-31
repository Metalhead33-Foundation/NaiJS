import * as NovelAI from '../index'

async function minz() {
    const udata = await NovelAI.getUserData(process.argv[2]);
    console.log(udata);
}
minz();