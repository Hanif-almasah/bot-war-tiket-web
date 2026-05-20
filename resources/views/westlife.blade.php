
@extends("layouts.app")
@section("title", "Westlife Ticket Bot - Dashboard")
@section('content')
 <div class="container mt-5">
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="card shadow-sm">
                    <div class="card-header bg-dark text-white text-center">
                        <h4 class="mb-0">Westlife Ticket Remote Control</h4>
                    </div>
                    <div class="card-body">
                        @if(session('success'))
                            <div class="alert alert-success">{{ session('success') }}</div>
                        @endif
                        @if(session('error'))
                            <div class="alert alert-danger">{{ session('error') }}</div>
                        @endif

                        <form action="/start-war" method="POST">
                            @csrf
                            <div class="mb-3">
                                <label for="url_loket" class="form-label fw-bold">Link URL Tiket Konser:</label>
                                <input type="url" name="url_loket" id="url_loket" class="form-control" placeholder="https://widget.loket.com/..." value="https://westlifestadiumshowjkt.com/" required>
                            </div>

                            <div class="mb-3">
                                <label for="selector_tombol" class="form-label fw-bold">Selector / Class Tombol Beli:</label>
                                <input type="text" name="selector_tombol" id="selector_tombol" class="form-control" placeholder="Contoh: .lp-button atau #buy-btn" value=".lp-button" required>
                                <div class="form-text text-muted">Gunakan tanda titik (.) untuk class, atau pagar (#) untuk ID sesuai hasil inspect element.</div>
                            </div>
                            
                            <div class="mb-3">
                                <label for="targetIndex" class="form-label fw-bold">Pilih tombol 0 - 6</label>
                                <input type="number" name="targetIndex" id="targetIndex" class="form-control" placeholder="Masukkan nomor tombol (0-6)" min="0" max="6" value="1" required>
                            </div>
                            <button type="submit" class="btn btn-danger w-100 fw-bold py-2">MULAI WAR SEKARANG</button>
                        </form>

                        <form action="/stop-war" method="POST" class="mt-3">
                            @csrf
                            <button type="submit" class="btn btn-secondary w-100 fw-bold py-2">BERHENTI WAR</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>

@endsection