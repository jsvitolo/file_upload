defmodule HelloWeb.UploadSignatureView do
    use HelloWeb, :view
  
    def render("create.json", %{signature: signature}) do
      signature
    end
  end