const Book = require("../models/Book");
const Author = require("../models/Author");

exports.createBook = async (req, res) => {
  try {

    console.log("Book Images : ",req.body.bookImages)

    // let images = [];
    // if (req.awsImages?.length > 0) {
    //   await req.awsImages.map((image) => {
    //     images.push(image);
    //   });
    // }
    let payload = {
      ...req.body,
      //frontCover: images?.[0],
      // backCover: images?.[1],
      frontCover: req.body.frontCover,
      backCover: req.body.backCover,
      bookUrl: req.body.bookUrl,
      textBook: req.body.textBook,
      epubBook: req.body.epubBook,
      bookMp3UrlFemale: req.body.bookMp3UrlFemale,
      bookMp3UrlMale: req.body.bookMp3UrlMale,
      previousSeriesLinks: req.body.previousSeriesLinks
        ? JSON.parse(req.body.previousSeriesLinks)
        : [],
      subCategory: JSON.parse(req.body.subCategory),
      libraries: JSON.parse(req.body.libraries),
      //bookImages: images.slice(2, images.length),
      //bookImages: JSON.parse(req.body.bookImages),
      bookImages: req.body.bookImages.slice(0, req.body.bookImages.length),
      fileListEpubChapter: req.body.fileListEpubChapter.slice(0, req.body.fileListEpubChapter.length),
      fileListTxtChapter: req.body.fileListTxtChapter.slice(0, req.body.fileListTxtChapter.length),

      chapterAudioMale: req.body.chapterAudioMale.slice(0, req.body.chapterAudioMale.length),
      chapterAudioFemale: req.body.chapterAudioFemale.slice(0, req.body.chapterAudioFemale.length),
      chapterAudioDramatic: req.body.chapterAudioDramatic.slice(0, req.body.chapterAudioDramatic.length),

      
    };


    Book.create(payload, (err, doc) => {
      if (err)
        return res.status(400).json({
          message: err,
        });
      Author.findById(req.body.author).then(async (author) => {
        author.books.push(doc._id);
        author.save();
        res.status(200).json({
          message: "Book Added Successfully",
        });
      });
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};

exports.getBookByCategory = async (req, res) => {
  try {
    Book.find({ category: req.params.id })
      .populate("subCategory author category libraries")
      .populate({
        path: "category",
        populate: {
          path: "material",
        },
      })
      .then((books) => {
        return res.status(200).json(books);
      });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};

exports.getAllAdmin = async (req, res) => {
  try {
    Book.find({})
      .populate("subCategory author category libraries")
      .populate({
        path: "category",
        populate: {
          path: "material",
        },
      })
      .then((books) => {
        res.status(200).json(books);
      });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};

exports.getAll = async (req, res) => {
  try {
    Book.find({ viewInLibrary: true })
      .populate("subCategory author category libraries")
      .populate({
        path: "category",
        populate: {
          path: "material",
        },
      })
      .then((books) => {
        res.status(200).json(books);
      });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};

exports.getAllByLibraryAdmin = async (req, res) => {
  try {
    console.log("req.body", req.body);
    Book.find({ libraries: { $in: req.body.libraries } })
      .populate("subCategory author category libraries")
      .populate({
        path: "category",
        populate: {
          path: "material",
        },
      })
      .then((books) => {
        res.status(200).json(books);
      });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};

exports.getAllByLibrary = async (req, res) => {
  try {
    Book.find({
      libraries: { $in: req.body.libraries },
      viewInLibrary: true,
    })
      .populate("subCategory author category libraries")
      .populate({
        path: "category",
        populate: {
          path: "material",
        },
      })
      .then((books) => {
        res.status(200).json(books);
      });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};

exports.getBook = async (req, res) => {
  try {
    Book.findById(req.params.id)
      .populate("subCategory author category libraries")
      .populate({
        path: "category",
        populate: {
          path: "material",
        },
      })
      .then((book) => {
        res.status(200).json(book);
      });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};

exports.editBook = async (req, res) => {
  try {
    //const { id, frontUpdated, backUpdated, existingImages } = req.body;
    const { id, frontCover, backCover, bookImages } = req.body;
    console.log("Id",id)
    console.log("Aws",req.awsImages)
    
    //const { id, frontUpdated, backUpdated } = req.body;

    // let existingImages;
    // try {
    //   console.log("Existing Images :",req.body)
    //   existingImages = JSON.parse(req.body.bookImages);
    // } catch (error) {
    //   return res.status(400).json({
    //     message: "Invalid JSON in existingImages",
    //   });
    // }

    console.log(`req.body`, req.body);
    let images = [];
    if (req.awsImages?.length > 0) {
      await req.awsImages.map((image) => {
        images.push(image);
      });
    }

    let payload = {
      ...req.body,
      subCategory: JSON.parse(req.body.subCategory),
      libraries: JSON.parse(req.body.libraries),
      previousSeriesLinks: JSON.parse(req.body.previousSeriesLinks),
    };
    let bookPreviousImages = JSON.parse(bookImages);
    Book.findByIdAndUpdate(id, payload, { new: true }, (err, doc) => {
      console.log("doc", doc);

      Book.findById(id).then(async (book) => {
        let bookNewImages = [];

        if (JSON.parse(frontCover) && JSON.parse(backCover)) {
          console.log("first");
          bookNewImages = [...images.slice(2, images.length)];
          book.frontCover = images?.[0];
          book.backCover = images?.[1];
        } else if (JSON.parse(frontCover) && !JSON.parse(backCover)) {
          bookNewImages = [...images.slice(1, images.length)];

          console.log("second");
          book.frontCover = images?.[0];
        } else if (!JSON.parse(frontCover) && JSON.parse(backCover)) {
          bookNewImages.push(images?.[0]);
          bookNewImages.push(...images.slice(2, images.length));

          console.log("third");
          book.backCover = images?.[1];
        } else {
          bookNewImages = images;
        }
        if (bookNewImages.length > 0) {
          book.bookImages = [...bookPreviousImages, ...bookNewImages];
        } else {
          book.bookImages = [...bookPreviousImages];
        }
        await book.save();
        res.status(200).json({
          message: "Book Updated",
        });
      });
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};

exports.ToggleViewLibrary = async (req, res) => {
  try {
    Book.findById(req.params.id).then((book) => {
      book.viewInLibrary = !book.viewInLibrary;
      book.save();
      res.status(200).json({
        message: "View In Library Updated.",
      });
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};

exports.search = async (req, res) => {
  try {
    // console.log(`req.body`, req.body);
    Book.find({
      name: { $regex: req.body.name, $options: "i" },
      libraries: { $in: req.body.libraries },
    })
      .populate("subCategory author category libraries")
      .populate({
        path: "category",
        populate: {
          path: "material",
        },
      })
      .then((books) => {
        res.status(200).json(books);
      });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};

exports.increaseCount = async (req, res) => {
  try {
    const { id } = req.params;
    Book.findById(id).then((book) => {
      book.viewFrequency += 1;
      book.save();
      res.status(200).json({
        message: "Count Increment",
      });
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};
