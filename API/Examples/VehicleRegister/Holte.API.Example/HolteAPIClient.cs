namespace Holte.API.Example;

public partial class HolteAPIClient
{
    [ActivatorUtilitiesConstructor]
    public HolteAPIClient(HttpClient httpClient) : this(string.Empty, httpClient)
    {

    }
}