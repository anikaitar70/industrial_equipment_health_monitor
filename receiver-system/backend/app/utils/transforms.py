import numpy as np
import scipy.fftpack


def uint8_to_float(img):
    """Convert uint8 image to float in range [0,1]."""
    result = np.ndarray(shape=img.shape, dtype='float')
    result[:] = img * (1. / 255)
    return result


def float_to_uint8(img):
    """Convert float image in range [0,1] to uint8."""
    result = np.ndarray(shape=img.shape, dtype='uint8')
    result[:] = np.clip(img * 255, 0, 255)
    return result


def float_to_int8(img):
    """Convert float image in range [0,1] to int8 centered around zero."""
    result = np.ndarray(shape=img.shape, dtype='int8')
    result[:] = np.clip((img * 255) - 127, -128, 127)
    return result


def temporal_ideal_filter(data, low, high, fps, axis=0, amplification_factor=1):
    """
    Apply an ideal bandpass filter on temporal axis of video data.

    Parameters:
        data: np.ndarray
            Video data, shape (frames, height, width, channels)
        low: float
            Low cutoff frequency (Hz)
        high: float
            High cutoff frequency (Hz)
        fps: float
            Frames per second of the video
        axis: int
            Axis corresponding to time (frames)
        amplification_factor: float
            Factor to amplify filtered signal

    Returns:
        np.ndarray
            Filtered video data with amplified bandpassed frequencies.
    """
    print(f"Applying bandpass between {low} and {high} Hz")

    # FFT along time axis
    fft = scipy.fftpack.fft(data, axis=axis)

    # Frequency values for each FFT bin
    frequencies = scipy.fftpack.fftfreq(data.shape[0], d=1.0 / fps)

    # Create a mask for frequencies within [low, high]
    mask = np.logical_and(frequencies >= low, frequencies <= high)

    # Reshape mask for broadcasting (frames, 1, 1, 1)
    mask = mask[:, np.newaxis, np.newaxis, np.newaxis]

    # Apply mask to FFT coefficients
    filtered_fft = fft * mask

    # Inverse FFT to get time domain signal
    filtered = scipy.fftpack.ifft(filtered_fft, axis=axis)

    # Return real part multiplied by amplification factor
    return np.real(filtered) * amplification_factor
