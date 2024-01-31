using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

namespace Holte.API.Example.Controllers;

[ApiController]
[EnableCors("AllowAll")]
[Route("VehicleRegister/[action]")]
public class VehicleRegisterController : ControllerBase
{
    private readonly HolteAPIClient _holteApi;

    public VehicleRegisterController(HolteAPIClient holteApi)
    {
        _holteApi = holteApi;
    }
    
    [HttpGet]
    public async Task<ICollection<CurrentTrackerDetails>> GetCurrentTrackerDetailsAsync(CancellationToken cancellationToken)
    {
        return await _holteApi.CurrentTrackerDetailAllAsync(null, null, cancellationToken);
    }
    
    [HttpGet]
    public async Task<ICollection<TrackerPoint>> GetVehicleTripsAsync(Guid vehicleId, CancellationToken cancellationToken)
    {
        return await _holteApi.TrackerPointAsync(vehicleId, DateTimeOffset.Now.AddDays(-7), DateTimeOffset.Now, string.Empty, cancellationToken);
    }
}