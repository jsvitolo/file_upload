defmodule HelloWeb.UploadSignatureController do
    use HelloWeb, :controller
  
    def create(conn, %{"filename" => filename, "mimetype" => mimetype}) do
      conn
      |> put_status(:created)
      |> render("create.json", signature: sign(filename, mimetype))
    end
  
    defp sign(filename, mimetype) do
      policy = policy(filename, mimetype)
      %{
        key: filename,
        'Content-Type': mimetype,
        acl: "private",
        success_action_status: "201",
        action: bucket_url(),
        'AWSAccessKeyId': aws_access_key_id(),
        policy: policy(filename, mimetype),
        signature: hmac_sha1(aws_secret_key(), policy)
      }
    end
  
    defp aws_access_key_id(), do: Application.get_env(:hello, :aws)[:access_key_id]
    defp aws_secret_key(), do: Application.get_env(:hello, :aws)[:secret_key]
  
    defp hmac_sha1(secret, msg) do
      :crypto.hmac(:sha, secret, msg)
        |> Base.encode64()
    end
  
    defp policy(key, mimetype, expiration_window \\ 60) do
      %{
        expiration: now_plus(expiration_window),
        conditions: [
          %{bucket: bucket_name()},
          %{acl: "private"},
          ["starts-with", "$Content-Type", mimetype],
          ["starts-with", "$key", key],
          %{success_action_status: "201"}
        ]
      }
      |> Poison.encode!
      |> Base.encode64()
    end
  
    defp now_plus(minutes) do
      secs = :calendar.datetime_to_gregorian_seconds(:calendar.universal_time)
      future_time = :calendar.gregorian_seconds_to_datetime(secs + 60 * minutes)
      { {year, month, day}, {hour, min, sec} } = future_time
      formatter = "~.4.0w-~.2.0w-~.2.0wT~.2.0w:~.2.0w:~.2.0wZ"
      formatted = :io_lib.format(formatter, [year, month, day, hour, min, sec])
  
      to_string(formatted)
    end
  
    defp bucket_name(), do: Application.get_env(:hello, :aws)[:bucket_name]
    defp bucket_url(), do: "https://#{bucket_name()}.s3.amazonaws.com"
  end