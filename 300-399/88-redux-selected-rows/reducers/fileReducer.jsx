import {types} from '../types/fileTypes.jsx'

const initialState = {
  files: [
    {id: 1, file: 'notes.txt', folder: 'txt', dateModified: '21 May 2017, 01:50:30', size: 14.7},
    {id: 2, file: 'book.pdf', folder: 'pdf', dateModified: '20 May 2017, 01:50:36', size: 2.1},
    {id: 3, file: 'cv.pdf', folder: 'pdf', dateModified: '20 May 2016, 11:50:26', size: 2.4},
    {id: 4, file: 'xyz.txt', folder: 'txt', dateModified: '17 Jan 2016, 08:03:12', size: 1.1},
    {id: 5, file: 'theme.mp3', folder: 'mp3', dateModified: '11 Sep 2016 08:03:07', size: 14.3},
    {id: 6, file: 'rock.mp3', folder: 'mp3', dateModified: '16 Sep 2016 03:05:37', size: 80.3},
    {id: 7, file: 'jazz.mp3', folder: 'mp3', dateModified: '18 Sep 2016 06:03:53', size: 90.5},
    {id: 8, file: 'abc.txt', folder: 'txt', dateModified: '17 Nov 2017, 10:04:02', size: 4.3},
  ],
}

export default function fileReducer(state = initialState, action) {
  const payload = action.payload;
  switch (action.type) {
    case types.NEW_FILE:
      return {
        files: [
          ...state.files,
          newFile(state.files, payload.folder)
        ]
      };
    case types.DELETE_FILE:
      return {
        files: deleteFile(state.files, payload.id)
      };
    default:
      return state;
  }
}

const newFile = (existingFiles, folder) => {
  const num = getNextUntitledFileNumber(existingFiles, folder);
  return {
    id: Math.random() * 100000 | 0, //likely to be unique due to Math.random seed
    file: `untitled${num > 0 ? num : ''}.${folder}`,
    folder: folder,
    dateModified: getCurrentDateString(),
    size: 0
  }
};

const getNextUntitledFileNumber = (existingFiles, folder) => {
  const untitledNumberMapper = f => {
    const num = f.file.split('.')[0].match(/\d+/g);
    return num && num.length > 0 ? parseInt(num) : 0;
  };

  return existingFiles
    .filter(f => f.folder === folder && f.file.slice(0, 8) === 'untitled')
    .map(untitledNumberMapper)
    .reduce((n1, n2) => Math.max(n1, n2), -1) + 1;
};

const deleteFile = (existingFiles, id) => existingFiles.filter(f => f.id !== id);

const getCurrentDateString = () => new Date().toLocaleString('en-gb',
  {year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'});