const fs = require('fs');

// 1. Update models/Gallery.ts
let galleryModel = fs.readFileSync('models/Gallery.ts', 'utf8');
galleryModel = galleryModel.replace(
  `export interface IGallery extends Document {
  title: string;
  imageUrl: string;
  category: string;
}`,
  `export interface IGallery extends Document {
  title: string;
  imageUrl: string;
  mediaType: string;
  category: string;
}`
);

galleryModel = galleryModel.replace(
  `const GallerySchema: Schema = new Schema({
  title: { type: String, required: true },
  imageUrl: { type: String, required: true },
  category: { type: String, required: true } // e.g. 'Events', 'Examinations', 'Students'
}, { timestamps: true });`,
  `const GallerySchema: Schema = new Schema({
  title: { type: String, required: true },
  imageUrl: { type: String, required: true },
  mediaType: { type: String, default: 'image' },
  category: { type: String, required: true } // e.g. 'Events', 'Examinations', 'Students'
}, { timestamps: true });`
);

fs.writeFileSync('models/Gallery.ts', galleryModel, 'utf8');

// 2. Update ClientApp.tsx
let clientApp = fs.readFileSync('app/ClientApp.tsx', 'utf8');

// A. State for mediaType in AdminGallery
const adminStateSearch = `  const [galleryTitle, setGalleryTitle] = useState("");
  const [galleryCategory, setGalleryCategory] = useState("Events");
  const [galleryImageUrl, setGalleryImageUrl] = useState("");`;
const adminStateReplace = `  const [galleryTitle, setGalleryTitle] = useState("");
  const [galleryCategory, setGalleryCategory] = useState("Events");
  const [galleryImageUrl, setGalleryImageUrl] = useState("");
  const [galleryMediaType, setGalleryMediaType] = useState("image");`;

clientApp = clientApp.replace(adminStateSearch, adminStateReplace);

// B. Upload logic in AdminGallery
const uploadPostSearch = `        body: JSON.stringify({
          title: galleryTitle,
          imageUrl: galleryImageUrl,
          category: galleryCategory,
        }),`;
const uploadPostReplace = `        body: JSON.stringify({
          title: galleryTitle,
          imageUrl: galleryImageUrl,
          mediaType: galleryMediaType,
          category: galleryCategory,
        }),`;
clientApp = clientApp.replace(uploadPostSearch, uploadPostReplace);

const uploadResetSearch = `        setGalleryTitle("");
        setGalleryCategory("Events");
        setGalleryImageUrl("");`;
const uploadResetReplace = `        setGalleryTitle("");
        setGalleryCategory("Events");
        setGalleryImageUrl("");
        setGalleryMediaType("image");`;
clientApp = clientApp.replace(uploadResetSearch, uploadResetReplace);

// C. UI Form in AdminGallery
const uploadFormSearch = `                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
                      Photo Upload *
                    </label>
                    <div className="flex flex-wrap items-center gap-4 rounded-lg border border-dashed border-stone-300 bg-stone-50 p-3">
                      {galleryImageUrl && (
                        <img
                          src={galleryImageUrl}
                          alt=""
                          className="h-12 w-20 rounded object-cover border"
                        />
                      )}
                      {/* Curly brace closed correctly! */}
                      <label className="cursor-pointer rounded border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-600 hover:bg-stone-50">
                        Choose Image
                        <input
                          type="file"
                          accept="image/*"`;

const uploadFormReplace = `                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
                      Media Upload *
                    </label>
                    <div className="flex flex-wrap items-center gap-4 rounded-lg border border-dashed border-stone-300 bg-stone-50 p-3">
                      {galleryImageUrl && (
                        galleryMediaType === "video" ? (
                          <video src={galleryImageUrl} className="h-12 w-20 rounded object-cover border" />
                        ) : (
                          <img src={galleryImageUrl} alt="" className="h-12 w-20 rounded object-cover border" />
                        )
                      )}
                      <label className="cursor-pointer rounded border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-600 hover:bg-stone-50">
                        Choose File
                        <input
                          type="file"
                          accept="image/*,video/*"`;

clientApp = clientApp.replace(uploadFormSearch, uploadFormReplace);

const uploadHandlerSearch = `                            const fd = new FormData();
                            fd.append("file", file);
                            fd.append("title", "Gallery Image");`;

const uploadHandlerReplace = `                            const fd = new FormData();
                            const isVideo = file.type.startsWith("video/");
                            setGalleryMediaType(isVideo ? "video" : "image");
                            fd.append("file", file);
                            fd.append("title", isVideo ? "Gallery Video" : "Gallery Image");`;

clientApp = clientApp.replace(uploadHandlerSearch, uploadHandlerReplace);

// D. Display in AdminGallery list
const adminListSearch = `                  <img
                    src={row.imageUrl}
                    alt=""
                    className="aspect-square w-full object-cover border rounded"
                  />`;

const adminListReplace = `                  {row.mediaType === "video" ? (
                    <video src={row.imageUrl} controls className="aspect-square w-full object-cover border rounded bg-black" />
                  ) : (
                    <img src={row.imageUrl} alt="" className="aspect-square w-full object-cover border rounded" />
                  )}`;

clientApp = clientApp.replace(adminListSearch, adminListReplace);

// E. Display in Public Gallery Strip (HomePage)
const galleryStripSearch = `<img
                src={item.imageUrl}
                alt={item.title}
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />`;

const galleryStripReplace = `{item.mediaType === 'video' ? (
                <video src={item.imageUrl} controls muted className="h-full w-full object-cover transition duration-700 group-hover:scale-105 bg-black" />
              ) : (
                <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
              )}`;
              
clientApp = clientApp.replace(galleryStripSearch, galleryStripReplace);

// F. Display in Public Gallery Page
const publicGallerySearch = `<img
                      src={item.imageUrl}
                      alt={"Institutional gallery moment " + (index + 1)}
                      className="aspect-square w-full object-cover transition duration-700 group-hover:scale-105"
                    />`;

const publicGalleryReplace = `{item.mediaType === 'video' ? (
                      <video src={item.imageUrl} controls muted className="aspect-square w-full object-cover transition duration-700 group-hover:scale-105 bg-black" />
                    ) : (
                      <img src={item.imageUrl} alt={"Institutional gallery moment " + (index + 1)} className="aspect-square w-full object-cover transition duration-700 group-hover:scale-105" />
                    )}`;
clientApp = clientApp.replace(publicGallerySearch, publicGalleryReplace);


fs.writeFileSync('app/ClientApp.tsx', clientApp, 'utf8');
console.log('Fixed Gallery to support videos');
