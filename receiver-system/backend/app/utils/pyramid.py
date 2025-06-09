import numpy
import cv2


def create_gaussian_image_pyramid(image, pyramid_levels):
    gauss_copy = numpy.ndarray(shape=image.shape, dtype="float")
    gauss_copy[:] = image
    img_pyramid = [gauss_copy]
    for pyramid_level in range(1, pyramid_levels):
        gauss_copy = cv2.pyrDown(gauss_copy)
        img_pyramid.append(gauss_copy)

    return img_pyramid


def create_laplacian_image_pyramid(image, pyramid_levels):
    gauss_pyramid = create_gaussian_image_pyramid(image, pyramid_levels)
    laplacian_pyramid = []
    for i in range(pyramid_levels - 1):
        up = cv2.pyrUp(gauss_pyramid[i + 1])
        up_resized = cv2.resize(up, (gauss_pyramid[i].shape[1], gauss_pyramid[i].shape[0]))
        laplacian_pyramid.append(gauss_pyramid[i] - up_resized)

    laplacian_pyramid.append(gauss_pyramid[-1])
    return laplacian_pyramid


def create_gaussian_video_pyramid(video, pyramid_levels):
    return _create_pyramid(video, pyramid_levels, create_gaussian_image_pyramid)


def create_laplacian_video_pyramid(video, pyramid_levels):
    return _create_pyramid(video, pyramid_levels, create_laplacian_image_pyramid)


def _create_pyramid(video, pyramid_levels, pyramid_fn):
    vid_pyramid = []
    # frame_count, height, width, colors = video.shape
    for frame_number, frame in enumerate(video):
        frame_pyramid = pyramid_fn(frame, pyramid_levels)

        for pyramid_level, pyramid_sub_frame in enumerate(frame_pyramid):
            if frame_number == 0:
                vid_pyramid.append(
                    numpy.zeros((video.shape[0], pyramid_sub_frame.shape[0], pyramid_sub_frame.shape[1], 3),
                                dtype="float"))

            vid_pyramid[pyramid_level][frame_number] = pyramid_sub_frame

    return vid_pyramid


def collapse_laplacian_pyramid(image_pyramid):
    img = image_pyramid.pop()
    while image_pyramid:
        upsampled = cv2.pyrUp(img)
        next_img = image_pyramid.pop()

        # Resize if needed
        if upsampled.shape != next_img.shape:
            upsampled = cv2.resize(upsampled, (next_img.shape[1], next_img.shape[0]))
            #print(f"Resizing from {upsampled.shape} to {next_img.shape}")

        img = upsampled + next_img
    return img


def collapse_laplacian_video_pyramid(pyramid):
    i = 0
    while True:
        try:
            img_pyramid = [vid[i] for vid in pyramid]
            pyramid[0][i] = collapse_laplacian_pyramid(img_pyramid)
            i += 1
        except IndexError:
            break
    return pyramid[0]

def build_laplacian_pyramid_video(video_tensor, levels=3):
    return create_laplacian_video_pyramid(video_tensor, levels)

def reconstruct_video_from_pyramid(pyramid):
    return collapse_laplacian_video_pyramid(pyramid)

