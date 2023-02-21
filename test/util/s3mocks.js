var {
	S3Client,
	PutObjectCommand,
	GetObjectCommand
} = require('@aws-sdk/client-s3')
var { mockClient } = require('aws-sdk-client-mock')
var { Readable } = require('stream')
var { sdkStreamMixin } = require('@aws-sdk/util-stream-node')

// FIXME: document this setup
module.exports = function setupS3Mock (buf) {
  const s3Mock = mockClient(S3Client)
  s3Mock.on(PutObjectCommand).resolves({ ETag: '1' })
  const stream = Readable.from(buf)
	// Adding the sdkStreamMixin to add extra functions to the stream to properly mock the response
	// Response format: https://github.com/aws/aws-sdk-js-v3#streams
	// mixin: https://github.com/aws/aws-sdk-js-v3/issues/1877#issuecomment-1287275227
  s3Mock.on(GetObjectCommand).resolves({ Body: sdkStreamMixin(stream) })
  return s3Mock
}
